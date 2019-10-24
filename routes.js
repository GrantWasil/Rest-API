'use strict';

const express = require('express');

// Construct a router instance.
const router = express.Router();

// Route that returns a list of users.
router.get('/users', (req, res) => {
  res.json(users);
});


// Route that returns a list of courses 
router.get('/users/courses', (req, res) => {
    // res.json() return courses 
}); 

// Route that returns a single course
router.get('/users/courses/:id', (req, res) => {

});



module.exports = router;