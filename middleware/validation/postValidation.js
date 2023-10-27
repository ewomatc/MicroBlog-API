const {body} = require('express-validator')

const validateCreatePost = [
    body('title')
    .trim()
    .escape()
    .isLength({ min: 5 }).withMessage('Title must be a minimum of 5 characters'),
    body('content')
    .trim()
    .escape()
    .isLength({ min: 5 }).withMessage('Content must be a minimum of 5 characters')
]

module.exports = {
  validateCreatePost
}