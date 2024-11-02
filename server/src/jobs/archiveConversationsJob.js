// server/src/jobs/archiveConversationsJob.js

const cron = require('node-cron');
const Conversation = require('../models/conversation');

// Function to archive inactive conversations
const archiveInactiveConversations = async () => {
  try {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    // Update conversations that are inactive for more than 2 days
    const conversationsToArchive = await Conversation.updateMany(
      {
        last_message_at: { $lt: twoDaysAgo },
        status: 'active'
      },
      { $set: { status: 'archived' } }
    );

    console.log(`Archived ${conversationsToArchive.modifiedCount} inactive conversations.`);
  } catch (error) {
    console.error('Error archiving conversations:', error);
  }
};

// Immediately archive inactive conversations on server startup
archiveInactiveConversations();

// Schedule the task to run daily at midnight
cron.schedule('0 0 * * *', () => {
  console.log('Running daily archiving job for inactive conversations...');
  archiveInactiveConversations();
});

module.exports = { archiveInactiveConversations };
