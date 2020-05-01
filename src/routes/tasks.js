const express = require('express');
const router = express.Router();

const isAuthenticated = require('../middlewares');

router.use(isAuthenticated);

module.exports = router;