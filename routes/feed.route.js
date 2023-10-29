const express = require('express');
const {
  validateCreatePost,
  validateUpdatePost
} = require('../middleware/validation/postValidation')

const {
  getPosts,
  createPost,
  getSinglePost,
  updatePost,
  deletePost
} = require('../controllers/feed.controller');

const router = express.Router();

// GET /feed/posts
router.get('/posts', getPosts);

// POST /feed/post
router.post('/post', validateCreatePost, createPost);

// GET /fed/post/podtid
router.get('/post/:postId', getSinglePost)

// PUT /feed/post/postId
router.put('/post/:postId', validateUpdatePost, updatePost)

router.delete('/post/:postId', deletePost)

module.exports = router;
