const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');

const {
    models
} = require('../db');
const {
    User,
} = models;

const userAuthentication = async (req, res, next) => {
    try {
        let message = null;

        // Parse the user's credentials from the Authorization header.
        const credentials = auth(req);

        // If the user's credentials are available...
        if (credentials) {
            // Attempt to retrieve the user from the data store
            // by their email  (i.e. the user's "key"
            // from the Authorization header).
            const user = await User.findOne({
                where: {
                    emailAddress: credentials.name
                },
            });

            // If a user was successfully retrieved from the data store...
            if (user) {
                // Use the bcryptjs npm package to compare the user's password
                // (from the Authorization header) to the user's password
                // that was retrieved from the data store.
                const authenticated = bcryptjs
                    .compareSync(credentials.pass, user.password);

                // If the passwords match...
                if (authenticated) {
                    console.log(`Authentication successful for: ${user.firstName}`);

                    // Then store the retrieved user object on the request object
                    // so any middleware functions that follow this middleware function
                    // will have access to the user's information.
                    req.currentUser = user;
                } else {
                    message = `Authentication failure for: ${user.firstName}`;
                }
            } else {
                message = `User not found with a first name: ${credentials.firstName}`;
            }
        } else {
            message = 'Auth header not found';
        }

        // If user authentication failed...
        if (message) {
            console.warn(message);

            // Return a response with a 401 Unauthorized HTTP status code.
            res.status(401).json({
                message: 'Access Denied'
            });
        } else {
            // Or if user authentication succeeded...
            // Call the next() method.
            next();
        }
    } catch (err) {
        next(err);
    }
};

module.exports = userAuthentication;