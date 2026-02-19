const express = require('express');
const router = express.Router();
const profilController = require('../controllers/profilController');

router.get('/', profilController.getProfil);
router.post('/update', profilController.postUpdateProfil);
router.post('/delete', profilController.postDeleteProfil);

module.exports = router;
