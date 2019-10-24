const express = require('express');
const router = express.Router();
const {
    models
} = require('../db');
const bcryptjs = require('bcryptjs');
const {
    User,
} = models;

// User Authentication Middleware 
const userAuthentication = require('../middleware/userAuthentication');
// User Validation Middleware 
const userValidation = require('../middleware/userValidation');

// Error tracking 
const {validationResult} = require('express-validator');

// Route that returns the currently authenticated user 
router.get('/users', userAuthentication, (req, res) => {
    const user = req.currentUser; 

    res.json({
        name: user.firstName + " " + user.lastName,
        email: user.emailAddress
    })
});

// Route that creates a new user 
router.post('/users', userValidation, (req, res) => {

    const errors = validationResult(req);

    // If there are validation errors..
    if (!errors.isEmpty()) {
        // Map over the errors to get a list 
        const errorMessages = errors.array().map(err => err.msg);

        // Return the validation errors to the client 
        res.status(400).json({
            errors: errorMessages
        });
    } else {
        // Get the user from the request body
        const user = req.body;
        // Hash the new user's password 
        user.password = bcryptjs.hashSync(user.password);
        // Add the user to the `users` db
        User.create(user)
        // Set the location header to `/`
        res.location('/');
        res.status(201).end();
    }
});

module.exports = router;