const express = require('express');
const router = express.Router();
const orgController = require('../controllers/organisation');
const upload = require('../middlewares/fileuploader');

router.get('/get', orgController.get);

router.post('/insert', orgController.insert);

router.post('/login', orgController.login);

router.post('/default/data', upload.single("data"), orgController.updateDefaultData);

router.post('/default/data/base', orgController.updateDefaultData);

module.exports = router;