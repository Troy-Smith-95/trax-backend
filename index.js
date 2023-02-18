const express = require('express');
const app = express();
const expressSession = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const knex = require("knex")(require("./knexfile"));
require('dotenv').config();

const PORT = process.env.PORT || 8080;

const genresRoute = require('./routes/genres');
const usersRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const inspirationRoute = require('./routes/inspiration');
const { populateData, getToken, auth_token } = require('./spotifyModels');


//Middleware
app.use(express.json());
app.use(helmet());
app.use(
    cors({
        origin: true,
        credentials: true,
    })
);
app.use(
    expressSession({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new SpotifyStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.SPOTIFY_CALLBACK_URL
        },
        function (accessToken, refreshToken, expires_in, profile, done) {

            console.log('Spotify profile:', profile._json.email);

            knex('users')
                .select('id')
                .where({ spotify_id: profile.id })
                .then(user => {
                    if (user.length) {
                        console.log(user);
                        // If user is found, pass the user object to serialize function
                        done(null, user[0]);
                    } else {
                        knex('users')
                            .select('id')
                            .where({ email: profile._json.email })
                            .then(userExisting => {
                                if (userExisting.length) {
                                    knex('users')
                                        .select('id')
                                        .where({ email: profile._json.email })
                                        .update({
                                            spotify_id: profile.id,
                                            display_name: profile.displayName,
                                            refresh_token: refreshToken
                                        })
                                        .then(userUpdated => {
                                            done(null, { id: userExisting[0] });
                                        })
                                        .catch(err => {
                                            console.log('Error adding info to current user', err);
                                        });
                                } else {
                                    // If user isn't found, we create a record
                                    knex('users')
                                        .insert({
                                            email: profile._json.email,
                                            spotify_id: profile.id,
                                            display_name: profile.displayName,
                                            refresh_token: refreshToken
                                        })
                                        .then(userId => {
                                            // Pass the user object to serialize function
                                            done(null, { id: userId[0] });
                                        })
                                        .catch(err => {
                                            console.log('Error creating a user', err);
                                        });
                                }
                            });
                    }
                })
                .catch(err => {
                    console.log('Error fetching a user', err);
                });
        }
    )
);

passport.serializeUser((user, done) => {
    console.log('serializeUser (user object):', user);

    // Store only the user id in session
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    console.log('deserializeUser (user id):', userId);

    // Query user information from the database for currently authenticated user
    knex('users')
        .where({ id: userId })
        .then(user => {
            // Remember that knex will return an array of records, so we need to get a single record from it
            console.log('req.user:', user[0]);

            // The full user object will be attached to request object as `req.user`
            done(null, user[0]);
        })
        .catch(err => {
            console.log('Error finding user', err);
        });
});

app.use('/genres', genresRoute);
app.use('/users', usersRoute);
app.use('/auth', authRoute);
app.use('/inspiration', inspirationRoute);

//Uncomment to get data
// populateData();


app.listen(PORT, () => {
    console.log(`🚀 Server listening on ${PORT}`);
});
