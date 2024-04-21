const express = require('express');
const stockRouter = express.Router();

const stock = require('../controllers/stock');

stockRouter.get('/', stock.getStocks);

module.exports = stockRouter;