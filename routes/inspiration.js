const express = require('express');
const router = express.Router();

const inspirationController = require('../controllers/inspirationController');

router.route('/generate').post(inspirationController.generatePlaylist);

module.exports = router;