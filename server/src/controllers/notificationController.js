const Subscription = require('../models/subscription');

const saveSubscription = async (subscription) => {
    const exists = await Subscription.findOne({ endpoint: subscription.endpoint });
    if (!exists) {
        const newSubscription = new Subscription(subscription);
        await newSubscription.save();
    }
};

module.exports = { saveSubscription };

