'use strict';

const express = require('express');
const router = express.Router();
const {
    models
} = require('../db');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const {
    Course
} = models;

/* Handler function to wrap each route. */
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (error) {
            res.status(500).send(error);
        }
    };
}

// Route that returns a list of courses 
router.get('/users/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll();
    res.json({
        courses
    });
}));

// Route that returns a single course
router.get('/users/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
        res.json(course);
    } else {
        res.status(404).json({
            message: "Course Not Found"
        })
    }
}));


// Route that will delete a single course 
router.delete('/users/courses/:id/', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
        await course.destroy();
        res.status(204);
    } else {
        res.status(404).json({
            message: "Course Not Found"
        })
    }
}))



module.exports = router;