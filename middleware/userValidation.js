'use strict';
const {
    check
} = require('express-validator');

const userValidation = [
    check('firstName')
    .exists({
        checkNull: true,
        checkFalsy: true
    })
    .withMessage('Please provide a value for "first name"'),
    check('lastName')
    .exists({
        checkNull: true,
        checkFalsy: true
    })
    .withMessage('Please provide a value for "last name"'),
    check('emailAddress')
    .exists({
        checkNull: true,
        checkFalsy: true
    })
    .withMessage('Please provide a value for "email address"')
    .isEmail()
    .withMessage('Please provide a valid email address for "email address"'),
    check('password')
    .exists({
        checkNull: true,
        checkFalsy: true
    })
    .withMessage('Please provide a value for "password"')
    .isLength({
        min: 8,
        max: 20
    })
    .withMessage('Please provide a value for "password" that is between 8 and 20 characters in length'),
]

module.exports = userValidation;