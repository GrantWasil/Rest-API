const {
    check
} = require('express-validator');

const courseValidation = [
    check('title')
    .exists({
        checkNull: true,
        checkFalsy: true
    })
    .withMessage('Please provide a value for "title"'),
    check('description')
    .exists({
        checkNull: true,
        checkFalsy: true
    })
    .withMessage('Please provide a value for "description"'),
]

module.exports = courseValidation;