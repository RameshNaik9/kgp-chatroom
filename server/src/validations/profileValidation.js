// /src/validations/profileValidation.js
const Joi = require('joi');

// Validation schema for user signup
const signupValidation = (data) => {
    const schema = Joi.object({
        rollNumber: Joi.string()
            .pattern(/^[0-9]{2}[A-Z]{2}[0-9]{5}$/) // Example pattern for roll number: 2 digits, 2 letters, 5 digits
            .required()
            .messages({
                'string.pattern.base': 'Roll number must follow the format: 4 digits, 2 letters, 4 digits.',
            }),
        department: Joi.string()
            .min(2)
            .max(50)
            .required()
            .messages({
                'string.min': 'Department name must be at least 2 characters long.',
                'string.max': 'Department name must be less than 50 characters long.',
            }),
        fullName: Joi.string()
            .min(3)
            .max(100)
            .required()
            .messages({
                'string.min': 'Full name must be at least 3 characters long.',
                'string.max': 'Full name must be less than 100 characters long.',
            }),
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Please provide a valid email address.',
            }),
        password: Joi.string()
            .min(8)
            .max(128)
            .required()
            .messages({
                'string.min': 'Password must be at least 8 characters long.',
                'string.max': 'Password must be less than 128 characters long.',
            }),
    });

    return schema.validate(data);
};

// Validation schema for user login
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Please provide a valid email address.',
            }),
        password: Joi.string()
            .min(8)
            .max(128)
            .required()
            .messages({
                'string.min': 'Password must be at least 8 characters long.',
                'string.max': 'Password must be less than 128 characters long.',
            }),
    });

    return schema.validate(data);
};

module.exports = { signupValidation, loginValidation };
