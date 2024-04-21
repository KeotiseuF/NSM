const express = require('express');
const cors = require('cors');
require('@dotenvx/dotenvx').config();

const app = express();

const port = process.env.PORT;

const stock = require('./routes/stock');
const crypto = require('./routes/crypto');

app.use(cors());

app.use('/stock', stock);
app.use('/crypto', crypto);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})