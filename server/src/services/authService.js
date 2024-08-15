// /src/services/authService.js
const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hasher');
const { generateToken } = require('../helpers/jwtHelper');

exports.registerUser = async (rollNumber, department, fullName, email, password) => {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const user = new User({ rollNumber, department, fullName, email, password: hashedPassword });
    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    return { token, user };
};

exports.loginUser = async (email, password) => {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    // Compare passwords
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = generateToken(user);

    return { token, user };
};
