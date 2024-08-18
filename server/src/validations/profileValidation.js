const Joi = require('joi');

// Validation schema for user signup
const signupValidation = (data) => {
    const schema = Joi.object({
        rollNumber: Joi.string()
            .pattern(/^[0-9]{2}[A-Z]{2}[0-9]{5}$/)
            .required()
            .messages({
                'string.pattern.base': 'Invalid Roll Number',
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
            .custom((value, helpers) => {
                if (!value.endsWith('@kgpian.iitkgp.ac.in')) {
                    return helpers.message('Please use your IIT Kharagpur email.');
                }
                return value;
            })
            .messages({
                'string.email': 'Please provide a valid email address.',
            }),
        password: Joi.string()
            .min(8)
            .max(128)
            .required()
            .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])'))
            .messages({
                'string.min': 'Password must be at least 8 characters long.',
                'string.max': 'Password must be less than 128 characters long.',
                'string.pattern.base': 'Keep strong Password',
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
            .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])'))
            .messages({
                'string.min': 'Password must be at least 8 characters long.',
                'string.max': 'Password must be less than 128 characters long.',
                'string.pattern.base': 'keep strong Password!',
            }),
    });

    return schema.validate(data);
};

module.exports = { signupValidation, loginValidation };
