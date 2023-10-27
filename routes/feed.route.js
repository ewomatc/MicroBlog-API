const express = require('express');
const {
  validateCreatePost
} = require('../middleware/validation/postValidation')

const {
  getPosts,
  createPost,
  getPost,
  getSinglePost
} = require('../controllers/feed.controller');

const router = express.Router();

// GET /feed/posts
router.get('/posts', getPosts);

// POST /feed/post
router.post('/post', validateCreatePost, createPost);

// GET /fed/post/podtid
router.get('/post/:postId', getSinglePost)

module.exports = router;
