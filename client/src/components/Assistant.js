import React, { useState } from 'react';
import Greeting from './Greeting';
import Cards from './Cards';
import MessageBar from './MessageBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Assistant.css';

const Assistant = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendMessage = async (message) => {
        if (loading) return; // Prevent multiple sends while loading
        setLoading(true); // Show loading until conversation ID is received

        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        try {
            // Start a new conversation
            const response = await axios.post(
                `http://localhost:8080/api/assistant/new-conversation?userId=${userId}`,
                { chat_profile: 'Career' },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const { conversation_id } = response.data;

            // Send the initial message to trigger the assistant response
            await axios.post(
                `http://localhost:8080/api/assistant/${conversation_id}`,
                { user_message: { content: message } }, // Send the initial message as payload
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Navigate to the conversation page after getting the response
            navigate(`/career-assistant/${conversation_id}`, { state: { initialMessage: message } });
        } catch (error) {
            console.error('Error starting new conversation or sending initial message:', error);
        } finally {
            setLoading(false);
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
