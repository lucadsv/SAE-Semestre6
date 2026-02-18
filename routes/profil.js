const express = require('express');
const router = express.Router();
const profilController = require('../controllers/profilController');

router.get('/', profilController.getProfil);

module.exports = router;