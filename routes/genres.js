const express = require('express');
const router = express.Router();

const genresController = require('../controllers/genresController');

router.route('/').get(genresController.getAll);

router.route('/:id/audio-features').get(genresController.getAudioFeatures);


module.exports = router;