const { body } = require('express-validator')
const cheerio = require('cheerio')
module.exports = [
    body('title')
        .not().isEmpty().withMessage('Title Can not be Empty ')
        .isLength({ max: 100 }).withMessage('Title can not be greater than 100 chars')
        .trim(),

    body('body')
        .not().isEmpty().withMessage('Body Can Not be Empty ')
        .custom(value => {
            let node = cheerio.load(value)
            let text = node.text()
            
            if(text.length > 5000){
                throw new error('Body can not be greater than 5000 chars')
            }
            return true
        })
]