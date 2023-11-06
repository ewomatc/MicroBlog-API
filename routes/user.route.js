const router = require('express').Router()
const validateCreateUser = require('../middleware/validation/userValidation')
const {
  signup,
  login,
} = require('../controllers/user.controller')

router.post('/signup', validateCreateUser, signup)

router.post('/login', login)


module.exports = router