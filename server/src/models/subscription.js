const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    endpoint: String,
    keys: {
        p256dh: String,
        auth: String
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);

