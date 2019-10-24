const express = require('express');
const router = express.Router();
const {
    models
} = require('../db');
const {
    Course
} = models;

// Course Validation Middleware 
const courseValidation = require('../middleware/courseValidation');

// User Authentication Middleware
const userAuthentication = require('../middleware/userAuthentication');

// Error tracking
const {
    validationResult
} = require('express-validator');

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
router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll();
    res.status(200).json({
        courses
    });
}));

// Route that returns a single course
router.get('/courses/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
        res.status(200).json(course);
    } else {
        res.status(404).json({
            message: "Course Not Found"
        })
    }
}));

// Route that creates a new course
router.post('/courses', userAuthentication, courseValidation, async (req, res) => {
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
        // Get the course from the request body
        const course = await Course.create(req.body);
        // Set the location header to the created id 
        res.location(`/api/courses/${course.id}`)
        res.status(201).end();
    }
});

// Route that updates a course 
router.put('/courses/:id', userAuthentication, courseValidation, asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
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
        if (course) {
            await course.update(req.body);
            res.status(204).json({
                course
            }).end();
        } else {
            res.status(404).json({
                message: "course not found"
            })
        }
    }
}))

// Route that will delete a single course 
router.delete('/courses/:id/', userAuthentication, asyncHandler(async (req, res) => {
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
        const course = await Course.findByPk(req.params.id);
        if (course) {
            await course.destroy();
            res.status(204).end();
        } else {
            res.status(404).json({
                message: "course not found"
            })
        }
    }
}))



module.exports = router;