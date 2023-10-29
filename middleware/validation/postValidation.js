const {body} = require('express-validator')

const validateCreatePost = [
    body('title', 'title is required')
    .not().isEmpty()
    .trim()
    .escape()
    .isLength({ min: 5 }).withMessage('Title must be a minimum of 5 characters'),
    body('content', 'content is required')
    .not().isEmpty()
    .trim()
    .escape()
    .isLength({ min: 5 }).withMessage('Content must be a minimum of 5 characters')
]

const validateUpdatePost = [
  body('title', 'title is required')
  .not().isEmpty()
  .trim()
  .escape()
  .isLength({min: 5}).withMessage('Title must be a minimum of 5 characters'),
  body('content', 'content is required')
  .not().isEmpty()
  .trim()
  .escape()
  .isLength({ min: 5 }).withMessage('Content must be a minimum of 5 characters')
]


module.exports = {
  validateCreatePost,
  validateUpdatePost
}