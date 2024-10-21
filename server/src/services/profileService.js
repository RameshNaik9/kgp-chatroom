// /src/services/profileService.js
const User = require('../models/user');

exports.getProfileInfoById = async (userId) => {
    const user = await User.findById(userId).select('-password');  // Exclude password
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};
