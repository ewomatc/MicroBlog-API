const express = require('express');
const path = require('path')
require('dotenv').config()
const bodyParser = require('body-parser');
const multer = require('multer')
const morgan = require('morgan')
require('./config/database.config')
const {errorHandler, notFoundErrorHandler} = require('./middleware/errorHandler')
const {fileFilter, fileStorage} = require('./middleware/multerConfig')

const feedRoutes = require('./routes/feed.route');

const app = express();


app.use(bodyParser.json());
app.use(multer({
  storage: fileStorage,
  fileFilter: fileFilter
}).single('image'))
// specify the images request handler
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

// register error handlers
app.use(errorHandler)
app.use(notFoundErrorHandler)


const port = 8000
app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`)
});