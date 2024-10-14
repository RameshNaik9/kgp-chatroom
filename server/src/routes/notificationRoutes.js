const express = require('express');
const { saveSubscription } = require('../controllers/notificationController');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const subscription = req.body;
        await saveSubscription(subscription);
        res.status(201).json({ message: 'Subscription saved successfully.' });
    } catch (error) {
        console.error('Error saving subscription:', error);
        res.status(500).json({ error: 'Failed to save subscription.' });
    }
});

module.exports = router;
