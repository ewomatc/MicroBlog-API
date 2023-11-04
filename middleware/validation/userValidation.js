const { body } = require('express-validator')
const User = require('../../models/user')

const validateCreateUser = [
  body('email', 'email is required')
  .not().isEmpty()
  .trim()
  .escape()
  .isEmail().withMessage('Email must be a valid email')
  .custom(async (value, {req}) => {
    const existingUser = await User.findOne({ email: value});
    if(existingUser) {
      res.status(409).json({ error: 'User with this email already exists' })
    }
    return true
  })
  .normalizeEmail(),
  body('name', 'name is required')
  .not().isEmpty()
  .trim()
  .escape()
  .isLength({ min: 3}).withMessage('Name must be a minimum of 3 characters'),
  body('password', 'password is required')
  .trim()
  .isLength({ min: 5}).withMessage('Password must be aminimum of 5 characters')
  .matches(/\d/).withMessage('password must contain at least one digit')
  .matches(/[A-Z]/).withMessage('password must contain at least one upercase letter')
]

module.exports = validateCreateUser