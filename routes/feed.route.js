const express = require('express');
const {
	validateCreatePost,
	validateUpdatePost,
} = require('../middleware/validation/postValidation');
const verifyAuth = require('../middleware/auth');

const {
	getPosts,
	createPost,
	getSinglePost,
	updatePost,
	deletePost,
} = require('../controllers/feed.controller');

const router = express.Router();

// GET /feed/posts
router.get('/posts', verifyAuth, getPosts);

// POST /feed/post
router.post('/post', validateCreatePost, verifyAuth, createPost);

// GET /fed/post/podtid
router.get('/post/:postId', verifyAuth, getSinglePost);

// PUT /feed/post/postId
router.put('/post/:postId', validateUpdatePost, verifyAuth, updatePost);

router.delete('/post/:postId', verifyAuth, deletePost);

module.exports = router;
