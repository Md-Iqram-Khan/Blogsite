const { body } = require('express-validator')
const User = require('../../models/User')

module.exports = [
      body('username')
            .isLength({ min : 2, max : 15 }).withMessage('Username must be beteween 2 to 15')
            .custom(async username => {
                  let user  = await User.findOne({ username})
                  if(user) {
                        return Promise.reject('Username Already Taken.')
                  }
            })
            .trim(),
      
      body('email')
            .isEmail().withMessage('Please provide a valid email')
            .custom(async email => {
                  let user  = await User.findOne({ email})
                  if(user) {
                        return Promise.reject('Email Already Taken.')
                  }
            })
            .normalizeEmail(),

      body('password')
            .isLength({min : 5}).withMessage('Password Must be Graeter than 5 characters'),

      body('confirmPassword')
      .custom(( confirmPassword, { req }) => {
            if( confirmPassword !== req.body.password) {
             throw new Error('Password does not matched')
            }
            return true
      }),
]
