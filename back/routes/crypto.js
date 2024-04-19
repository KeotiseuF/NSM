const express = require('express');
const router = express.Router();

const crypto = require('../controllers/crypto');

router.get('/', crypto.getCryptos);

module.exports = router;