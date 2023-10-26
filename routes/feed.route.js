const express = require('express');
const {body} = require('express-validator')

const feedController = require('../controllers/feed.controller');

const router = express.Router();

// GET /feed/posts
router.get('/posts', feedController.getPosts);

// POST /feed/post
router.post('/post', 
  [
    body('title').trim().isLength({ min: 5 }).withMessage('Title must be a minimum of 5 characters'),
    body('content').trim().isLength({ min: 5 })  
  ],
  feedController.createPost);

module.exports = router;