const express = require('express');
const router = express.Router();
const tvController = require('../controllers/tvController');
const upload = require('../middlewares/fileuploader');

router.get('/', tvController.getAllTV);

router.put('/single/update', tvController.updateSingleTv);

router.post('/post/data', upload.single("data"), tvController.addTvData);

router.post('/post/data/base',tvController.addTvData);

router.post('/register', tvController.addTv);

router.post('/onetvdata', tvController.getOneTVData);

module.exports = router;