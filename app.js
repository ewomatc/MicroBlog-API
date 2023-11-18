const express = require('express');
const path = require('path');
require('dotenv').config();
const bodyParser = require('body-parser');
const multer = require('multer');
const morgan = require('morgan');
require('./config/database.config');
const {
	errorHandler,
	notFoundErrorHandler,
} = require('./middleware/errorHandler');
const { fileFilter, fileStorage } = require('./middleware/multerConfig');

const feedRoutes = require('./routes/feed.route');
const userRoutes = require('./routes/user.route');
const { Server } = require('net');

const app = express();

app.use(bodyParser.json());
app.use(
	multer({
		storage: fileStorage,
		fileFilter: fileFilter,
	}).single('image')
);
// specify the images request handler
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(morgan('tiny'));

//CORS
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'OPTIONS, GET, POST, PUT, PATCH, DELETE'
	);
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

app.use('/api/feed', feedRoutes);
app.use('/api/user', userRoutes);
app.get('/', (req, res) => {
	res.json({ success: true, message: 'welcome to MicroBlog API ' });
});

// register error handlers
app.use(errorHandler);
app.use(notFoundErrorHandler);

const port = 8000;
const server = require('http').createServer(app);
const io = require('./socket').init(server)

const startServer = () => {
	server.listen(port, () => {
		console.log(`server is running on http://localhost:${port}`);
	});

	io.on('connection', (socket) => {
		console.log('client connected');
	});
};

startServer();
