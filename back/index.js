const express = require('express');
const cors = require('cors');
require('@dotenvx/dotenvx').config();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const app = express();

const port = process.env.PORT || 3000;

const stock = require('./routes/stock');
const crypto = require('./routes/crypto');
const excel = require('./routes/excel');

app.use(cors(), jsonParser);

app.use('/stock', stock);
app.use('/crypto', crypto);
app.use('/excel', excel);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})