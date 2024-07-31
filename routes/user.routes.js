const express = require('express');
const router = express.Router();
const userController = require('../controllers/controllerUser');

router.get('/get', userController.get);

router.post('/login', )

module.exports = router;