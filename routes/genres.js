const { json } = require('express');
const express = require('express');
const router = express.Router();

const genresController = require('../controllers/genresController');

router.route('/').get(genresController.getAll);


module.exports = router;