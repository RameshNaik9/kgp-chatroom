// const Message = require('../models/message');

// // Stream the assistant response using SSE
// const streamAssistantResponse = async (req, res) => {
//     const { conversation_id } = req.params;

//     try {
//         // Set headers for SSE
//         res.setHeader('Content-Type', 'text/event-stream');
//         res.setHeader('Cache-Control', 'no-cache');
//         res.setHeader('Connection', 'keep-alive');
//         res.flushHeaders(); // Flush headers to establish SSE connection immediately

//         console.log(`Starting SSE for conversation: ${conversation_id}`);

//         // Fetch the assistant's response from the message collection
//         const message = await Message.findOne({ conversation_id });

//         if (!message || !message.assistant_response) {
//             console.error('No assistant response found for conversation:', conversation_id);
//             throw new Error('No assistant response found');
//         }

//         // Log the assistant response before streaming
//         console.log('Assistant response to stream:', message.assistant_response.content);

//         // Stream the response in chunks (split by sentence, word, or any logical chunk)
//         const assistantResponse = message.assistant_response.content;

//         // Example: Streaming word by word or sentence by sentence
//         const chunks = assistantResponse.split(' '); // Split by word or sentence
//         for (const chunk of chunks) {
//             res.write(`data: ${chunk}\n\n`); // Stream each chunk
//             await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between chunks
//         }

//         // Signal the end of the stream
//         res.write('event: end\n');
//         res.write('data: \n\n');
//         res.end();
//         console.log('SSE stream ended successfully');

//     } catch (error) {
//         console.error('Error streaming assistant response:', error.message);
//         res.setHeader('Content-Type', 'text/event-stream');
//         res.write('event: error\n');
//         res.write(`data: ${error.message}\n\n`);
//         res.end();
//     }
// };

// module.exports = {
//     streamAssistantResponse
// };
const Message = require('../models/message');

// Stream the assistant response using SSE
const streamAssistantResponse = async (req, res) => {
    const { conversation_id } = req.params;

    try {
        // Set headers for SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders(); // Flush headers to establish SSE connection immediately

        console.log(`Starting SSE for conversation: ${conversation_id}`);

        // Fetch the latest message with the assistant response for the conversation
        const message = await Message.findOne({ conversation_id }).sort({ createdAt: -1 });

        if (!message || !message.assistant_response) {
            console.error('No assistant response found for conversation:', conversation_id);
            throw new Error('No assistant response found');
        }

        // Log the assistant response before streaming
        console.log('Assistant response to stream:', message.assistant_response.content);

        // Stream the response in larger chunks (sentences or paragraphs)
        const assistantResponse = message.assistant_response.content;

        // Example: Stream by sentence or by some logical chunk
        const chunks = assistantResponse.split(/(\.|,|!|\n)/); // Split by sentences or logical chunks
        for (const chunk of chunks) {
            if (chunk.trim()) {  // Don't stream empty chunks
                res.write(`data: ${chunk.trim()}\n\n`); // Stream each chunk
                await new Promise(resolve => setTimeout(resolve, 300)); // Small delay between chunks
            }
        }

        // Signal the end of the stream
        res.write('event: end\n');
        res.write('data: \n\n');
        res.end();
        console.log('SSE stream ended successfully');

    } catch (error) {
        console.error('Error streaming assistant response:', error.message);
        res.setHeader('Content-Type', 'text/event-stream');
        res.write('event: error\n');
        res.write(`data: ${error.message}\n\n`);
        res.end();
    }
};

module.exports = {
    streamAssistantResponse
};
