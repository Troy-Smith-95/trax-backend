const axios = require('axios');
const knex = require("knex")(require("./knexfile"));
const qs = require('qs');
const { v4: uuid } = require('uuid');
require('dotenv').config();

//amount of time to delays axios calls by in milliseconds
const ms = 5;

const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

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
    let response;
    try {
        response = await axios.post(URL_TOKEN, data, headers)
    } catch (error) {
        console.log(`Error retrieving access token: ${error}`);
        getToken();
    }
    return response.data.access_token;
}


async function getTracks(playlist, authHeader) {
    try {
        const tracks_info = await getPlaylist(playlist, authHeader);
        const playlist_length = tracks_info.total;
        const playlist_tracks = tracks_info.items;
        const tracks = [];
        console.log(playlist_length);

        for (let i = 0; i < playlist_length; i++) {
            const newTrack = {};
            let track;
            async function getTrack() {
                try {
                    track = await axios.get(`${playlist_tracks[i].track.href}`, authHeader);

                } catch (error) {
                    console.log(`Error in getting a specific track: ${error}`);
                    getTrack();
                }
            }
            await sleep(ms);
            await getTrack();
            newTrack.id = uuid();
            newTrack.track_name = track.data.name;
            newTrack.genre_id = playlist.genre_id;
            newTrack.playlist_id = playlist.id;
            newTrack.spotify_id = track.data.id;
            let analysis;
            async function getAudioFeatures() {
                try {
                    analysis = await axios.get(`${URL_API}/audio-features/${newTrack.spotify_id}`, authHeader);

                } catch (error) {
                    console.log(`Error in getting audio features of a specific track: ${error}`);
                    getAudioFeatures();
                }
            }
            await sleep(ms);
            await getAudioFeatures();
            //console.log(analysis.data);
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
            tracks.push(newTrack);
        }
        return tracks;
    } catch (error) {
        console.log(`General error in getTracks function: ${error}`);
    }
}

async function getPlaylist(playlist, authHeader) {
    let response;
    try {
        response = await axios.get(`${URL_API}/playlists/${playlist.spotify_id}`, authHeader);
    } catch (error) {
        console.log(`Error getting playlist: ${error}`);
        getPlaylist();
    }
    console.log(response.data.tracks.items[0].track.href);
    return response.data.tracks;
}

async function getAverages(genreTracks) {
    genreAvgs = {
        acousticness: 0,
        danceability: 0,
        duration_ms: 0,
        energy: 0,
        instrumentalness: 0,
        key: [],
        liveness: 0,
        loudness: 0,
        mode: [],
        speechiness: 0,
        tempo: 0,
        time_signature: [],
        valence: 0
    };

    for (let i = 0; i < genreTracks.length; i++) {
        genreAvgs.acousticness += genreTracks[i].acousticness;
        genreAvgs.danceability += genreTracks[i].danceability;
        genreAvgs.duration_ms += genreTracks[i].duration_ms;
        genreAvgs.energy += genreTracks[i].energy;
        genreAvgs.instrumentalness += genreTracks[i].instrumentalness;
        genreAvgs.key.push(genreTracks[i].key);
        genreAvgs.liveness += genreTracks[i].liveness;
        genreAvgs.loudness += genreTracks[i].loudness;
        genreAvgs.mode.push(genreTracks[i].mode);
        genreTracks.speechiness += genreTracks[i].speechiness;
        genreAvgs.tempo += genreTracks[i].tempo;
        genreAvgs.time_signature.push(genreTracks[i].time_signature);
        genreAvgs.valence += genreTracks[i].valence;
    }

    genreAvgs.acousticness = genreAvgs.acousticness/genreTracks.length;
    genreAvgs.danceability = genreAvgs.danceability/genreTracks.length;
    genreAvgs.duration_ms = genreAvgs.duration_ms/genreTracks.length;
    genreAvgs.energy = genreAvgs.energy/genreTracks.length;
    genreAvgs.instrumentalness = genreAvgs.instrumentalness/genreTracks.length;
    genreAvgs.key = await findMode(genreAvgs.key);
    genreAvgs.liveness = genreAvgs.liveness/genreTracks.length;
    genreAvgs.loudness = genreAvgs.loudness/genreTracks.length;
    genreAvgs.mode = await findMode(genreAvgs.mode);
    genreTracks.speechiness =genreAvgs.speechiness/genreTracks.length;
    genreAvgs.tempo = genreAvgs.tempo/genreTracks.length;
    genreAvgs.time_signature = await findMode(genreAvgs.time_signature);
    genreAvgs.valence = genreAvgs.valence/genreTracks.length;

    return genreAvgs;
}

async function findMode(array) {
    const object = {};
    
    for (let i = 0; i < array.length; i++) {
        if (object[array[i]]) {
            object[array[i]] += 1;
        } else {
            object[array[i]] = 1;
        }
    }

    let mostOccurance = object[array[0]];
    let mostOccuranceKey = array[0];

    Object.keys(object).forEach(key => {
        if (object[key] > mostOccurance) {
            mostOccurance = object[key];
            mostOccuranceKey = key;
        }
    });

    return mostOccuranceKey;
}

async function populateData() {
    await knex('tracks').del();
    access_token.token = await getToken();
    access_token.timestamp = Date.now();
    const authHeader = {
        headers: {
            'Authorization': `Bearer ${access_token.token}`,
        }
    }
    const playlists = await knex('playlists');

    for (let i = 0; i < playlists.length; i++) {
        const tracks = await getTracks(playlists[i], authHeader);
        await knex('tracks').insert(tracks);
    }

    const genres = await knex('genres');

    for (let i = 0; i < genres.length; i++) {
        const genreTracks = await knex('tracks').where({ genre_id: genres[i].id });
        const genreAvg = await getAverages(genreTracks);
        genreAvg.genre_id = genres[i].id;
        genreAvg.id = uuid();
        genreAvg.created_at = Date.now();
        await knex('genre_avg_audio_features').insert(genreAvg);
        console.log(genreAvg);
    }
    console.log(access_token);
}

module.exports = {
    populateData,
    getToken,
    auth_token
}