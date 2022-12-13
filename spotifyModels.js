const axios = require('axios');
const knex = require("knex")(require("./knexfile"));
const qs = require('qs');
const { v4: uuid } = require('uuid');
require('dotenv').config();

//amount of time to delays axios calls by in milliseconds
const ms = 50;

//Function to delay axios calls to avoid hitting rate limit
const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

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

//Function to orchestrate the collection of data 
async function populateData() {
    //Delete tracks from previous week
    await knex('tracks').del();

    //Retrieve array of playlists from database
    const playlists = await knex('playlists');

    //Get new access token to make API calls with
    await getToken();

    //Loop through playlists and get all the track data
    for (let i = 0; i < playlists.length; i++) {
        let tracks_tries = 0;
        const tracks = await getTracks(playlists[i], authHeader, tracks_tries);
        //Insert track data from playlist into database
        await knex('tracks').insert(tracks);
        await getToken();
    }

    //Retrieve array of genres from database
    const genres = await knex('genres');

    //Loop through genres and get the average audio features for each genre
    for (let i = 0; i < genres.length; i++) {
        //Retrieve all tracks associated with the genre
        const genreTracks = await knex('tracks').where({ genre_id: genres[i].id });
        //Get the average audio values for the tracks in that genre
        const genreAvg = await getAverages(genreTracks);
        genreAvg.genre_id = genres[i].id;
        genreAvg.id = uuid();
        genreAvg.created_at = Date.now();
        //Insert genre average audio features into database
        await knex('genre_avg_audio_features').insert(genreAvg);
    }
    console.log(access_token);
}

//Function to get all the data for the tracks in a playlist
async function getTracks(playlist, authHeader, tracks_tries) {
    try {
        //Get playlist data from spotify API
        const tracks_info = await getPlaylist(playlist, authHeader);
        const playlist_length = tracks_info.length;
        const playlist_tracks = tracks_info;
        const tracks = [];
        console.log(playlist_length);

        //Loop through playlist track list to get data on each individual track
        for (let i = 0; i < playlist_length; i++) {
            //Declare new track object
            const newTrack = {};
            //track the number of calls to the API if it has an error to avoid potential infinite loops
            let track_tries = 0;
            //Wrapping API call in a function allows for it to be called recursively in case of an error being thrown
            async function getTrack(track_id) {
                try {
                    return await axios.get(`${track_id}`, authHeader);

                } catch (error) {
                    console.log(`Error in getting a specific track: ${error}`);
                    //If the returned status is too many requests this will delay any futher calls for the amount of time stated in the retry-after part of the header
                    if (error.response.status === 429) {
                        await sleep(JSON.parse(Object.values(error.response.headers)[1]) * 1001);
                    }
                    track_tries++;
                    if (track_tries < 5) {
                        return getTrack(track_id);
                    }
                }
            }
            //Time delay API call
            await sleep(ms);
            const track = await getTrack(playlist_tracks[i].track.href);
            //Only assign if track API call was successfull
            if (track !== undefined) {
                //Assign values to new track
                newTrack.id = uuid();
                newTrack.track_name = track.data.name;
                newTrack.genre_id = playlist.genre_id;
                newTrack.playlist_id = playlist.id;
                newTrack.spotify_id = track.data.id;
                //track the number of calls to the API if it has an error to avoid potential infinite loops
                let audio_tries = 0;
                //Wrapping API call in a function allows for it to be called recursively in case of an error being thrown
                async function getAudioFeatures(spotify_id) {
                    try {
                        return await axios.get(`${URL_API}/audio-features/${spotify_id}`, authHeader);

                    } catch (error) {
                        console.log(`Error in getting audio features of a specific track: ${error}`);
                        if (error.response.status === 429) {
                            await sleep(JSON.parse(Object.values(error.response.headers)[1]) * 1001);
                        }
                        audio_tries++;
                        if (audio_tries < 5) {
                            return getAudioFeatures(spotify_id);
                        }
                    }
                }
                //Time delay API call
                await sleep(ms);
                const analysis = await getAudioFeatures(newTrack.spotify_id);
                //Only assign if analysis API call was successfull
                if (analysis) {
                    //Assign audio features to new track
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
                    //Add new track to array of tracks for the playlist
                    tracks.push(newTrack);
                }
            }
        }
        return tracks;
    } catch (error) {
        console.log(`General error in getTracks function: ${error}`);
        if (error.response.status === 429) {
            await sleep(JSON.parse(Object.values(error.response.headers)[1]) * 1001);
        }
        tracks_tries++;
        if (tracks_tries < 3) {
            getTracks(playlist, authHeader, tracks_tries);
        }
    }
}

async function getPlaylist(playlist, authHeader) {
    let response;
    //track the number of calls to the API if it has an error to avoid potential infinite loops
    let playlist_tries = 0;
    //Wrapping API call in a function allows for it to be called recursively in case of an error being thrown
    async function playlist(playlist, authHeader) {
        try {
            response = await axios.get(`${URL_API}/playlists/${playlist.spotify_id}/tracks`, authHeader);
            const tracks = response.data.items;
            if (response.data.next) {
                const responseTwo = await axios.get(`${response.data.next}`, authHeader);
                const newTracks = tracks.concat(responseTwo.data.items);
                return newTracks;
            }
            return tracks;
        } catch (error) {
            console.log(`Error getting playlist: ${error}`);
            if (error.response.status === 429) {
                await sleep(JSON.parse(Object.values(error.response.headers)[1]) * 1001);
            }
            playlist_tries++;
            if (playlist_tries < 10) {
                return playlist(playlist, authHeader);
            }
        }
    }
    return await playlist(playlist, authHeader);
}

//Get the average audio features of the tracks in a given genre
async function getAverages(genreTracks) {
    //Construct object to contain the averages
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

    //Loop through tracks in the genre
    for (let i = 0; i < genreTracks.length; i++) {
        //Total values for all tracks in the genre
        genreAvgs.acousticness += genreTracks[i].acousticness;
        genreAvgs.danceability += genreTracks[i].danceability;
        genreAvgs.duration_ms += genreTracks[i].duration_ms;
        genreAvgs.energy += genreTracks[i].energy;
        genreAvgs.instrumentalness += genreTracks[i].instrumentalness;
        //A value where most occuring value is more meaningful than average
        genreAvgs.key.push(genreTracks[i].key);
        genreAvgs.liveness += genreTracks[i].liveness;
        genreAvgs.loudness += genreTracks[i].loudness;
        //A value where most occuring value is more meaningful than average
        genreAvgs.mode.push(genreTracks[i].mode);
        genreAvgs.speechiness += genreTracks[i].speechiness;
        genreAvgs.tempo += genreTracks[i].tempo;
        //A value where most occuring value is more meaningful than average
        genreAvgs.time_signature.push(genreTracks[i].time_signature);
        genreAvgs.valence += genreTracks[i].valence;
    }
    //Divid total values by the amount of tracks to get the average
    genreAvgs.acousticness = genreAvgs.acousticness / genreTracks.length;
    genreAvgs.danceability = genreAvgs.danceability / genreTracks.length;
    genreAvgs.duration_ms = genreAvgs.duration_ms / genreTracks.length;
    genreAvgs.energy = genreAvgs.energy / genreTracks.length;
    genreAvgs.instrumentalness = genreAvgs.instrumentalness / genreTracks.length;
    //Call function to the value that occurs the most
    genreAvgs.key = await findMode(genreAvgs.key);
    genreAvgs.liveness = genreAvgs.liveness / genreTracks.length;
    genreAvgs.loudness = genreAvgs.loudness / genreTracks.length;
    genreAvgs.mode = await findMode(genreAvgs.mode);
    genreAvgs.speechiness = genreAvgs.speechiness / genreTracks.length;
    genreAvgs.tempo = genreAvgs.tempo / genreTracks.length;
    genreAvgs.time_signature = await findMode(genreAvgs.time_signature);
    genreAvgs.valence = genreAvgs.valence / genreTracks.length;

    return genreAvgs;
}

//Function to find the value that occurs the most in an array
async function findMode(array) {
    const object = {};
    //Loop through array
    for (let i = 0; i < array.length; i++) {
        //If a key equal to that value exists increment its count
        if (object[array[i]]) {
            object[array[i]] += 1;
            //If a key equal to that value doesn't exist create it and set its count to one
        } else {
            object[array[i]] = 1;
        }
    }

    let mostOccurance = object[array[0]];
    let mostOccuranceKey = array[0];

    //Loop through the keys to see which one has most occurances 
    Object.keys(object).forEach(key => {
        if (object[key] > mostOccurance) {
            mostOccurance = object[key];
            mostOccuranceKey = key;
        }
    });

    return mostOccuranceKey;
}

module.exports = {
    populateData,
    getToken,
    auth_token
}