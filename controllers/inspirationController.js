const knex = require("knex")(require("../knexfile"));
const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

const { URL_TOKEN, URL_API, CLIENT_ID, CLIENT_SECRET } = process.env;

//creating auth token to send in call to spotify API to get access token
const auth_token = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`, 'utf-8').toString('base64');

const headers = {
    headers: {
        "Accept": "*/*",
        'Authorization': `Basic ${auth_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
    }
}

const data = qs.stringify({ 'grant_type': 'client_credentials' });

const access_token = {};

const authHeader = {};

//function to retrieve the access token 
async function getToken() {
    let response;
    try {
        response = await axios.post(URL_TOKEN, data, headers)
    } catch (error) {
        console.log(`Error retrieving access token: ${error}`);
        return getToken();
    }
    access_token.token = response.data.access_token;
    access_token.timestamp = Date.now();
    //Construct header for API calls
    authHeader.headers = { 'Authorization': `Bearer ${access_token.token}` };
}

const generatePlaylist = async (req, res) => {
    await getToken();

    const {params} = req.body;

    const tracksList = [];

    const options = {
        params: params,
        headers: {
            'Authorization': `Bearer ${access_token.token}`
        }
    }
    
    try {
        const recomendations = await axios.get(`${URL_API}/recommendations`, options); 
        const recomendationTracks = recomendations.data.tracks;
        for (i = 0; i < recomendationTracks.length; i++)    {
            const newTrack = {};
            newTrack.name = recomendationTracks[i].name;
            newTrack.artist = recomendationTracks[i].artists[0].name;
            newTrack.uri = recomendationTracks[i].uri;
            if (recomendationTracks[i].album.images.length) {
                newTrack.artwork = recomendationTracks[i].album.images[0].url;
            }
            tracksList.push(newTrack);
        }  
        return res.status(200).send(tracksList);
    } catch (error) {
        console.log(`Error retrieving recommendations playlist: ${error}`)
    }
}

module.exports = {
    generatePlaylist
}