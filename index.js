const express = require('express');
const app = express();
const cors = require('cors');
const knex = require("knex")(require("./knexfile"));
require('dotenv').config();

const PORT = process.env.PORT || 8080;

const genresRoute = require('./routes/genres');
const {populateData, getToken, auth_token} = require('./spotifyModels');


//Middleware
app.use(cors());
app.use(express.json());

app.use('/genres', genresRoute);

//Uncomment to get data
// populateData();



app.listen(PORT, () => {
    console.log(`🚀 Server listening on ${PORT}`);
});