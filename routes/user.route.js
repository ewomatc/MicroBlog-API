const router = require('express').Router()
const validateCreateUser = require('../middleware/validation/userValidation')
const {
  signup,
} = require('../controllers/user.controller')

router.post('/signup', validateCreateUser, signup)


module.exports = router