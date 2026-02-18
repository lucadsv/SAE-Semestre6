const express = require('express');
const router = express.Router();
const jeuController = require('../controllers/jeuController');

router.get('/', jeuController.getJeu);

module.exports = router;