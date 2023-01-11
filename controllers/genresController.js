const knex = require("knex")(require("../knexfile"));
require('dotenv').config();





const getAll = async (req, res) => {
    try {
        const genres = await knex('genres');
        res.status(200).json(genres);
    } catch(error) {
        res.status(400).json(`Error retrieving genres: ${error}`);
    }
}

const getAudioFeatures = async (req, res) => {
    try {
        const audioFeatures = await knex('genre_avg_audio_features').where({ genre_id: req.params.id}).orderBy('created_at', 'desc');
        res.status(200).json(audioFeatures);
    } catch(error) {
       res.status(400).json(`Error retrieving audio features: ${error}`);
    }
}


module.exports = {
    getAll, 
    getAudioFeatures
}

