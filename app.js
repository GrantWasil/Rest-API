'use strict';

const {
  sequelize,
  models
} = require('./db');

// Get references to the models 
const {
  User,
  Course
} = models;

// load modules
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const courseRoutes = require('./routes/course');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// TODO setup your api routes here
console.log('Testing the connection to the database...');

// Placeholder for testing database connection
(async () => {
  try {
    // Test the connection to the database
    console.log('Connection to the database successful!');
    await sequelize.authenticate();
    
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      console.error('Validation errors: ', errors);
    } else {
      throw error;
    }
  }
})();

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// Add Routes. 
app.use('/api/', userRoutes);
app.use('/api/', courseRoutes);


// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});

module.exports = app;