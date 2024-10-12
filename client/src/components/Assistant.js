import React, { useState } from 'react';
import Greeting from './Greeting';
import Cards from './Cards';
import MessageBar from './MessageBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Assistant.css';

const Assistant = () => {
    const [loading, setLoading] = useState(false);
    const [initialMessage, setInitialMessage] = useState(''); // Save the first message
    const navigate = useNavigate();

    const handleSendMessage = async (message) => {
        setLoading(true); // Show loading until conversation ID is received
        setInitialMessage(message); // Save the first message typed

        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post(
                `http://localhost:8080/api/assistant/new-conversation?userId=${userId}`,
                { chat_profile: 'career' },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const { conversation_id } = response.data;

            // Navigate to the conversation page after getting conversation_id
            navigate(`/career-assistant/${conversation_id}`, { state: { initialMessage: message } });
        } catch (error) {
            console.error('Error starting new conversation:', error);
        } finally {
            setLoading(false); // Hide loading
        }
    };

    return (
        <div className="assistant-container">
            {loading ? <p>Loading...</p> : (
                <>
                    <Greeting />
                    <Cards />
                    <MessageBar onSend={handleSendMessage} />
                </>
            )}
        </div>
    );
};

export default Assistant;
