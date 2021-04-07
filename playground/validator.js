const router = require('express').Router()
const { check, validationResult } = require('express-validator')

router.get('/validator/signup', (req, res, next) => {

      console.log(req.flash('fail'));
      console.log(req.flash('success'));

      res.render('/playground/signup', {title: 'Validator Palyground'})
})

router.post('/validator', 
[
      check('username')
            .not()
            .isEmpty()
            .withMessage(`Username Can not be empty`)
            .isLength({ max: 15 })
            .withMessage(`Length can not be greater than 15`)
            .trim(),

      check('email')
            .isEmail()
            .withMessage('Please provide a valid Email')
            .normalizeEmail(),

      check('password')
            .custom( value => {
                  if ( value.length < 5 ){
                        throw new Error('Password Must be greater than 5 charecters')
                  }
                  return true
            }),

     check('confirmPassword')
            .custom( (value, {req} ) => {
                  if ( value !== req.body.password ){
                        throw new Error('Password Does Not Matched')
                  }
                  return true
            }),
      
],
 (req, res, next) => {
      let errors = validationResult(req)

      if(!errors.isEmpty()){
            req.flash('fail', 'There is some Error')
      } else {
            req.flash('success', 'There is no Error')
      }

      res.redirect('/playground/validator')
})

module.exports = router