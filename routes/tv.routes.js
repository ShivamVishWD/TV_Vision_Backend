const express = require('express');
const router = express.Router();
const tvController = require('../controllers/tvController');

router.get('/', tvController.getAllTV);

router.post('/post/data',tvController.addTvData);

router.post('/post/data/base',tvController.addTvData);

router.post('/register', tvController.addTv);

router.post('/onetvdata', tvController.getOneTVData);

module.exports = router;