// /src/controllers/profileController.js
const profileService = require('../services/profileService');

exports.getProfileInfo = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const userProfile = await profileService.getProfileInfoById(userId);
        res.status(200).json(userProfile);
    } catch (error) {
        next(error);
    }
};
