// /src/routes/profileRoutes.js
const express = require('express');
const profileController = require('../controllers/profileController');
const router = express.Router();

// Get profile information by userId
router.get('/get-profile-info/:userId', profileController.getProfileInfo);

module.exports = router;
