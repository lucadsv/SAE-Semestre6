const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

router.get('/', mainController.getAccueil);
router.get('/login', mainController.getConnexion);
router.get('/connexion', mainController.getConnexion);
router.post('/login', mainController.postConnexion);
router.get('/register', mainController.getInscription);
router.get('/inscription', mainController.getInscription);
router.post('/register', mainController.postInscription);
router.get('/logout', mainController.getLogout);

module.exports = router;
