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

        // Stream the response in markdown-friendly chunks
        const assistantResponse = message.assistant_response.content;

        // Preserve paragraphs and newlines (use double newlines to split paragraphs)
        // const chunks = assistantResponse.split(/\n\n/); // Split by double newlines for paragraphs

        // Split by double newlines for paragraphs, but preserve newlines inside markdown elements
        // const chunks = assistantResponse.split(/(\n{2,})/); // Split into chunks while preserving newlines
        const chunks = assistantResponse.split(/\n/); // Split by single newline


        for (const chunk of chunks) {
            if (chunk.trim()) {  // Skip empty chunks
                res.write(`data: ${chunk}\n\n`); // Send markdown-friendly chunks
                await new Promise(resolve => setTimeout(resolve, 300)); // Delay for better streaming UX
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
