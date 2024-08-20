// /src/controllers/chatController.js
const chatService = require('../services/chatService');

async function loadFilter() {
    try {
        const module = await import('bad-words');
        const Filter = module.default || module.Filter || module;
        return new Filter();
    } catch (error) {
        console.error("Error loading Filter from bad-words:", error);
        throw error;
    }
}

const handleNewMessage = async (socket, io) => {
    let filter;
    try {
        filter = await loadFilter();
    } catch (error) {
        console.error("Could not initialize the bad-words filter. Skipping profanity check.");
    }
    socket.on('sendMessage', async (messageData, callback) => {
        try {
            let messageToSave = messageData.message;

            if (filter && filter.isProfane(messageData.message)) {
                messageToSave = 'This message was deleted due to inappropriate language.';
            }

            const modifiedMessageData = {
                ...messageData,
                message: messageToSave,
            };

            const savedMessage = await chatService.saveMessage(modifiedMessageData);
            const populatedMessage = await chatService.getMessageWithPopulation(savedMessage._id);

            io.emit('newMessage', populatedMessage);

            if (filter && filter.isProfane(messageData.message)) {
                if (callback) {
                    callback({ status: 'ok', message: 'Message was deleted due to inappropriate language.' });
                }
            } else {
                if (callback) {
                    callback({ status: 'ok' });
                }
            }
        } catch (error) {
            console.error('Error handling new message:', error);
            if (callback) {
                callback({ status: 'error', message: error.message });
            }
        }
    });

    socket.on('deleteMessage', async ({ messageId }, callback) => {
        try {
            await chatService.deleteMessage(messageId);
            io.emit('deleteMessage', messageId);

            if (callback) {
                callback({ status: 'ok' });
            }
        } catch (error) {
            console.error('Error deleting message:', error);
            if (callback) {
                callback({ status: 'error', message: error.message });
            }
        }
    });

    socket.on('editMessage', async ({ messageId, newMessage }, callback) => {
        try {
            const filter = await loadFilter();
            let filteredMessage = newMessage;

            const isProfane = filter && filter.isProfane(newMessage);
            if (isProfane) {
                filteredMessage = 'This message was deleted due to inappropriate language.';
            }

            const updatedMessage = await chatService.editMessage(messageId, filteredMessage);

            const populatedMessage = await chatService.getMessageWithPopulation(updatedMessage._id);

            io.emit('editMessage', populatedMessage);

            if (callback) {
                if (isProfane) {
                    callback({ status: 'ok', message: 'Message was deleted due to inappropriate language.' });
                } else {
                    callback({ status: 'ok' });
                }
            }
        } catch (error) {
            console.error('Error editing message:', error);
            if (callback) {
                callback({ status: 'error', message: error.message });
            }
        }
    });
};

const getMessages = async (req, res) => {
    try {
        const messages = await chatService.getAllMessages();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    handleNewMessage,
    getMessages,
};

// // /src/controllers/chatController.js
// const chatService = require('../services/chatService');

// async function loadFilter() {
//     try {
//         const module = await import('bad-words');
//         const Filter = module.default || module.Filter || module;
//         return new Filter();
//     } catch (error) {
//         console.error("Error loading Filter from bad-words:", error);
//         throw error;  // rethrow to prevent execution when filter is unavailable
//     }
// }

// const handleNewMessage = async (socket, io) => {
    // let filter;
    // try {
    //     filter = await loadFilter();
    // } catch (error) {
    //     console.error("Could not initialize the bad-words filter. Skipping profanity check.");
    // }

//     socket.on('sendMessage', async (messageData, callback) => {
//         try {
//             let messageToSave = messageData.message;

//             if (filter && filter.isProfane(messageData.message)) {
//                 messageToSave = 'This message was deleted due to inappropriate language.';
//             }

//             const modifiedMessageData = {
//                 ...messageData,
//                 message: messageToSave,
//             };

//             const savedMessage = await chatService.saveMessage(modifiedMessageData);
//             const populatedMessage = await chatService.getMessageWithPopulation(savedMessage._id);

//             io.emit('newMessage', populatedMessage);  // Emit the modified message

//             if (filter && filter.isProfane(messageData.message)) {
//                 if (callback) {
//                     callback({ status: 'ok', message: 'Message was deleted due to inappropriate language.' });
//                 }
//             } else {
//                 if (callback) {
//                     callback({ status: 'ok' });
//                 }
//             }
//         } catch (error) {
//             console.error('Error handling new message:', error);
//             if (callback) {
//                 callback({ status: 'error', message: error.message });
//             }
//         }
//     });

//     socket.on('deleteMessage', async ({ messageId }, callback) => {
//         try {
//             await chatService.deleteMessage(messageId);
//             io.emit('deleteMessage', messageId);

//             if (callback) {
//                 callback({ status: 'ok' });
//             }
//         } catch (error) {
//             console.error('Error deleting message:', error);
//             if (callback) {
//                 callback({ status: 'error', message: error.message });
//             }
//         }
//     });

//     socket.on('editMessage', async ({ messageId, newMessage }, callback) => {
//         try {
//             if (filter && filter.isProfane(newMessage)) {
//                 socket.emit('message deleted', 'Your message was removed due to inappropriate language.');
//                 if (callback) {
//                     callback({ status: 'error', message: 'Message contains inappropriate language.' });
//                 }
//                 return;
//             }

//             const updatedMessage = await chatService.editMessage(messageId, newMessage);
//             io.emit('editMessage', updatedMessage);

//             if (callback) {
//                 callback({ status: 'ok' });
//             }
//         } catch (error) {
//             console.error('Error editing message:', error);
//             if (callback) {
//                 callback({ status: 'error', message: error.message });
//             }
//         }
//     });
// };

// const getMessages = async (req, res) => {
//     try {
//         const messages = await chatService.getAllMessages();
//         res.json(messages);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// module.exports = {
//     handleNewMessage,
//     getMessages,
// };
