const express = require('express');
const router = express.Router();
const calcController = require('../controllers/calcController');

router.get('/', calcController.getCalculs);

module.exports = router;