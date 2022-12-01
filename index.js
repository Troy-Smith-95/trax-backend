const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 8080;

const genresRoute = require('./routes/genres');
const {populateData, getToken, auth_token} = require('./spotifyModels');


//Middleware
app.use(cors());
app.use(express.json());

app.use('/genres', genresRoute);


// populateData();
// knex('tracks').where({track_name: "Rich Flex"}).then((data) => console.log(data));


app.listen(PORT, () => {
    console.log(`🚀 Server listening on ${PORT}`);
});