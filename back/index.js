const express = require('express');
const cors = require('cors');

const app = express();

const port = 3001;

const crypto = require('./routes/crypto');

app.use(cors());

app.use('/crypto', crypto);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})