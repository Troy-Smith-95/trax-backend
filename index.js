const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
const knex = require("knex")(require("./knexfile"));
const qs = require('qs');
require('dotenv').config();

const PORT = process.env.PORT || 8080;

const genresRoute = require('./routes/genres');
const { response } = require('express');


//Middleware
app.use(cors());
app.use(express.json());

app.use('/genres', genresRoute);

const { URL_TOKEN, URL_API, CLIENT_ID, CLIENT_SECRET } = process.env;

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

async function getToken() {
    const response = await axios.post(URL_TOKEN, data, headers)
    return response.data.access_token;
}


async function getTracks(playlist, authHeader) {
    const tracks_info = await getPlaylist(playlist, authHeader);
    const playlist_length = tracks_info.total;
    const playlist_tracks = tracks_info.items;
    const tracks = [];
    console.log(playlist_length);
    const track = await axios.get(`${playlist_tracks[0].track.href}`, authHeader);
    const newTrack = {};
    newTrack.track_name = track.data.name;
    newTrack.genre_id = playlist.genre_id;
    newTrack.playlist_id = playlist.id;
    newTrack.spotify_id = track.data.id;
    const analysis = await axios.get(`${URL_API}/audio-features/${newTrack.spotify_id}`, authHeader);
    newTrack.acousticness = analysis.data.acousticness;
    newTrack.danceability = analysis.data.danceability;
    newTrack.duration_ms = analysis.data.duration_ms;
    newTrack.energy = analysis.data.energy;
    newTrack.instrumentalness = analysis.data.instrumentalness;
    newTrack.key = analysis.data.key;
    newTrack.liveness = analysis.data.liveness;
    newTrack.loudness = analysis.data.loudness;
    newTrack.mode = analysis.data.mode;
    newTrack.speechiness = analysis.data.speechiness;
    newTrack.tempo = analysis.data.tempo;
    newTrack.time_signature = analysis.data.time_signature;
    newTrack.valence = analysis.data.valence;
    console.log(newTrack);
    console.log(analysis.data);
    for (let i = 0; i < playlist_length; i++) {

    }
}

async function getPlaylist(playlist, authHeader) {
    const response = await axios.get(`${URL_API}/playlists/${playlist.spotify_id}`, authHeader);
    console.log(response.data.tracks.items[0].track.href);
    return response.data.tracks;
}

async function populateData() {
    access_token.token = await getToken();
    access_token.timestamp = Date.now();
    const authHeader = {
        headers: {
            'Authorization': `Bearer ${access_token.token}`,
        }
    }
    const playlists = await knex('playlists')
    await getTracks(playlists[0], authHeader);
    console.log(access_token);
    console.log(playlists);
}

populateData();


app.listen(PORT, () => {
    console.log(`🚀 Server listening on ${PORT}`);
});