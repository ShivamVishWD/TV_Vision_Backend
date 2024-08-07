const express = require('express');
const router = express.Router();
const userController = require('../controllers/controllerUser');

router.get('/get', userController.get);

router.post('/login', userController.login);

router.post('/insert', userController.insert);

router.put('/update', userController.update);

module.exports = router;