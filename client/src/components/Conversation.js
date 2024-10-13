import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Conversation = () => {
    const { conversation_id } = useParams(); // Get conversation_id from URL
    const [messages, setMessages] = useState([]); // Store conversation messages
    const [loading, setLoading] = useState(false); // Loading state for assistant response
    const [userMessage, setUserMessage] = useState(''); // Message input
    const token = localStorage.getItem('token');

    useEffect(() => {
        // Fetch conversation history when the page loads or is refreshed
        fetchConversationHistory();
    }, [conversation_id]);

    // Fetch existing conversation history from backend
    const fetchConversationHistory = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:8080/api/assistant/conversation/${conversation_id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages(response.data.messages); // Load conversation messages
        } catch (error) {
            console.error('Error fetching conversation history:', error);
        } finally {
            setLoading(false);
        }
    };

    // Send user message to assistant in an ongoing conversation
    const sendMessage = async () => {
        if (!userMessage.trim()) return; // Avoid sending empty messages

        // Append the user's message immediately to the conversation
        const newMessage = {
            message_id: 'temp-' + new Date().getTime(), // Temporary message ID
            user_message: { content: userMessage },
            assistant_response: { content: 'Waiting for assistant response...' } // Placeholder for assistant response
        };

        setMessages((prev) => [...prev, newMessage]);
        setUserMessage(''); // Clear input field after sending

        try {
            // Send the user message to the backend
            const response = await axios.post(
                `http://localhost:8080/api/assistant/${conversation_id}`,
                { user_message: { content: userMessage } }, // Send user message as payload
                { headers: { Authorization: `Bearer ${token}` } } // Attach Bearer token
            );

            // Replace the placeholder with the actual assistant response
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.message_id === newMessage.message_id
                        ? response.data // Replace temporary message with actual response
                        : msg
                )
            );
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="conversation-container">
            <div className="messages-list">
                {messages.map((msg) => (
                    <div key={msg.message_id} className="message-item">
                        <p><strong>You:</strong> {msg.user_message.content}</p>
                        {msg.assistant_response?.content && (
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
