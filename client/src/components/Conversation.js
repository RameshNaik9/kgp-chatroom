import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Conversation = () => {
    const { conversation_id } = useParams(); // Get conversation_id from URL
    const [messages, setMessages] = useState([]); // Store conversation messages
    const [loading, setLoading] = useState(false); // Loading state
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

        setLoading(true); // Show loading while waiting for assistant response

        try {
            const response = await axios.post(
                `http://localhost:8080/api/assistant/${conversation_id}`,
                { user_message: { content: userMessage } }, // Send user message as payload
                { headers: { Authorization: `Bearer ${token}` } } // Attach Bearer token
            );

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
