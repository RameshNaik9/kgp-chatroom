// /src/controllers/authController.js
const { signupValidation, loginValidation } = require('../validations/profileValidation');
const authService = require('../services/authService');

exports.register = async (req, res, next) => {
    try {
        // Validate the request data
        const { error } = signupValidation(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { rollNumber, department, fullName, email, password } = req.body;

        // Validate IIT Kharagpur email domain
        if (!email.endsWith('@kgpian.iitkgp.ac.in')) {
            return res.status(400).send('Please use your IIT Kharagpur email.');
        }

        const { user } = await authService.registerUser(rollNumber, department, fullName, email, password);
        res.status(201).json({ user });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        // Validate the request data
        const { error } = loginValidation(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { email, password } = req.body;
        const { token, user } = await authService.loginUser(email, password);

        // Send the token only in the header
        res.header('Access-Token', token).status(200).json({ user, token });
    } catch (error) {
        next(error);
    }
};
