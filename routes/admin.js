const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/create-accounts', adminController.getCreateAccounts);
router.post('/create-accounts/manual', adminController.postCreateAccount);
router.post('/create-accounts/csv', adminController.postImportCsv);
router.get('/manage-accounts', adminController.getManageAccounts);
router.post('/manage-accounts/delete', adminController.postDeleteAccount);

module.exports = router;
