const express = require('express');
const router = express.Router();

router.use("/organisation", require('./organisation.routes'));

router.use("/user", require('./user.routes'));

router.use("/tv", require('./tv.routes'));

module.exports = router;