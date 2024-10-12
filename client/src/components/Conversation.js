import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Conversation = () => {
    const { conversation_id } = useParams(); // Get conversation_id from URL
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userMessage, setUserMessage] = useState('');

    const token = localStorage.getItem('token');
    // const userId = localStorage.getItem('userId');

    useEffect(() => {
        console.log('Conversation Component is rendering, conversation_id:', conversation_id); // Debug log
        if (conversation_id) {
            // Optional initial API call can be placed here if necessary
        }
    }, [conversation_id]);


    const sendMessage = async () => {
        if (!userMessage.trim()) return;

        setLoading(true); // Show loading while waiting for assistant response

        try {
            // Make API call to send the user message
            const response = await axios.post(
                `http://localhost:8080/api/assistant/${conversation_id}`,
                { user_message: { content: userMessage } }, // Send user message as payload
                { headers: { Authorization: `Bearer ${token}` } } // Attach Bearer token
            );

            // Append the new message to the conversation
            setMessages((prev) => [...prev, response.data]); // Ensure this correctly appends the response
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false); // Hide loading after response
            setUserMessage(''); // Clear input field after sending
        }
    };


    return (
    <div className="conversation-container">
        <h2>Conversation Component</h2> {/* Check if this heading renders */}
        <div className="messages-list">
            {messages.map((msg) => (
                <div key={msg.message_id} className="message-item">
                    <p><strong>You:</strong> {msg.user_message.content}</p>
                    <p><strong>Assistant:</strong> {msg.assistant_response.content}</p>
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
