import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom'; // Use useLocation to get initial message

const Conversation = () => {
    const { conversation_id } = useParams(); // Get conversation_id from URL
    const location = useLocation(); // Get initialMessage from state
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userMessage, setUserMessage] = useState('');
    const initialMessage = location.state?.initialMessage || ''; // Get the first message

    const token = localStorage.getItem('token');

    useEffect(() => {
        console.log('Conversation Component is rendering, conversation_id:', conversation_id);

        // Add the initial message to the messages list
        if (initialMessage) {
            setMessages((prev) => [
                ...prev,
                {
                    message_id: 'initial',
                    user_message: { content: initialMessage },
                    assistant_response: { content: '' } // Placeholder for assistant response
                }
            ]);

            // Immediately call the assistant's response API for the initial message
            getAssistantResponse(initialMessage);
        }
    }, [conversation_id, initialMessage]);

    // Function to fetch the assistant's response for the initial message
    const getAssistantResponse = async (message) => {
        setLoading(true);

        try {
            console.log('Making API call to:', `http://localhost:8080/api/assistant/${conversation_id}`);
            const response = await axios.post(
                `http://localhost:8080/api/assistant/${conversation_id}`,
                { user_message: { content: message } }, // Send user message as payload
                { headers: { Authorization: `Bearer ${token}` } } // Attach Bearer token
            );

            // Log the response for debugging
            console.log('API Response for assistant:', response.data);

            // Append the assistant's response to the initial message
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages];
                updatedMessages[updatedMessages.length - 1].assistant_response.content = response.data.assistant_response.content;
                return updatedMessages;
            });
        } catch (error) {
            console.error('Error fetching assistant response:', error);
        } finally {
            setLoading(false); // Hide loading after response
        }
    };

    const sendMessage = async () => {
        console.log('Send Message Function Called'); // Debug log to check if function is called

        if (!userMessage.trim()) {
            console.log('Message is empty. Not sending request.');
            return; // Avoid sending empty messages
        }

        setLoading(true); // Show loading while waiting for assistant response

        try {
            // Make API call to send the user message
            console.log('Making API call to:', `http://localhost:8080/api/assistant/${conversation_id}`);
            const response = await axios.post(
                `http://localhost:8080/api/assistant/${conversation_id}`,
                { user_message: { content: userMessage } }, // Send user message as payload
                { headers: { Authorization: `Bearer ${token}` } } // Attach Bearer token
            );

            // Log the response for debugging
            console.log('API Response:', response.data);

            // Append the new message to the conversation
            setMessages((prev) => [...prev, response.data]);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false); // Hide loading after response
            setUserMessage(''); // Clear input field after sending
        }
    };

    return (
        <div className="conversation-container">
            <h2>Conversation Component</h2>
            <div className="messages-list">
                {messages.map((msg) => (
                    <div key={msg.message_id} className="message-item">
                        <p><strong>You:</strong> {msg.user_message.content}</p>
                        {msg.assistant_response.content && (
                            <p><strong>Assistant:</strong> {msg.assistant_response.content}</p>
                        )}
                    </div>
                ))}
            </div>

            {loading && <p>Waiting for assistant response...</p>}

            <div className="message-input">
                <input 
                    type="text" 
                    value={userMessage} 
                    onChange={(e) => setUserMessage(e.target.value)} 
                    placeholder="Type your message..." 
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Conversation;
