const User = require('../models/user')
const {validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')

exports.signup = async (req, res, next) => {
  try{
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
      return res.status(400).json({ error: errors.mapped()})
    }

    const {
      email,
      name,
      password
    } = req.body

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = new User({
      email,
      name,
      password: hashedPassword
    })
    await user.save()
    res.status(201).json({
      success: true,
      user
    })
    
  } catch(err) {
    next(err)
  }
}