const express = require('express');
const router = express.Router();
const orgController = require('../controllers/organisation');

router.get('/get', orgController.get);

router.post('/insert', orgController.insert);

router.post('/login', orgController.login);

module.exports = router;