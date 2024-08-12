const express = require('express');
const router = express.Router();
const tvController = require('../controllers/tvController');
const upload = require('../middlewares/fileuploader');

router.get('/', tvController.getAllTV);

router.put('/single/update', tvController.updateSingleTv);

router.post('/post/data', upload.array("data"), tvController.addTvData);

// For Photo Upload
// router.post('/post/data/base',tvController.addTvData);

router.post('/register', tvController.addTv);

router.post('/onetvdata', tvController.getOneTVData);

// Schedule Data API's

router.post('/schedule/data', upload.single('data'), tvController.scheduleData);

// For Schedule Photo
// router.post('/schedule/data/base', tvController.scheduleData);

module.exports = router;