const { body } = require('express-validator')
const validator = require('validator')

const linkValidator = value => {
    if(value){
        if(!validator.isURL(value)){
            throw new Error('Please provide a valid url')
        }
    }
    return true
}

module.exports = [
    body('name')
            .not().isEmpty().withMessage('Name Can not be empty.')
            .isLength({ max: 50}).withMessage('Name can not be more than 50 chars.')
            .trim(),
    body('title')
           .not().isEmpty().withMessage('Title Can not be empty.')
           .isLength({ max: 100}).withMessage('Title can not be more than 100 chars.')
           .trim(),

   body('bio')
           .not().isEmpty().withMessage('Bio Can not be empty.')
           .isLength({ max: 500}).withMessage('Title can not be more than 500 chars.')
           .trim(),

    body('website')
            .custom(linkValidator),

    body('facebook')
            .custom(linkValidator),

    body('twitter')
            .custom(linkValidator),
    
    body('github')
            .custom(linkValidator),  
]
