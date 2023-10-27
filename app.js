const express = require('express');
const path = require('path')
require('dotenv').config()
const bodyParser = require('body-parser');
const morgan = require('morgan')
require('./config/database.config')

const feedRoutes = require('./routes/feed.route');

const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(morgan('tiny'))

//cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/api/feed', feedRoutes);


app.use(function (err, req, res, next) {
  console.error(err.stack);

  const status = err.statusCode || 500;

  const errorResponse = {
    error: err.message || 'Something went wrong',
  };

  res.status(status).json(errorResponse);
});



app.use(function (req, res, next) {
  res.status(404).json({ error: 'Resource Not Found' });
});

const port = 8000
app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`)
});