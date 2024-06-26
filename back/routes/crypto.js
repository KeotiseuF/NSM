const express = require('express');
const cryptoRouter = express.Router();

const crypto = require('../controllers/crypto');

cryptoRouter.get('/', crypto.getCryptos);

module.exports = cryptoRouter;