import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'; // For markdown rendering
import './Conversation.css'; 

const Conversation = () => {
    const { conversation_id } = useParams(); // Get conversation_id from URL
    const [messages, setMessages] = useState([]); // Store conversation messages
    const [chatTitle, setChatTitle] = useState(''); // Store chat title
    const [chatProfile, setChatProfile] = useState(''); // Store chat profile
    const [createdAt, setCreatedAt] = useState(''); // Store the conversation start date (createdAt)
    const [loading, setLoading] = useState(false); // Loading state for assistant response
    const [userMessage, setUserMessage] = useState(''); // Message input
    const [error, setError] = useState(''); // Error message state
    const messagesEndRef = useRef(null); // Ref for scrolling to the bottom
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const fullName = localStorage.getItem('fullName') || 'there';

    useEffect(() => {
        // Fetch conversation history and chat profile when the page loads or is refreshed
        fetchConversationHistory();
    }, [conversation_id]);

    useEffect(() => {
        // Scroll to the bottom when a new message is added
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Fetch existing conversation history, chat title, chat profile, and createdAt date from the backend
    const fetchConversationHistory = async () => {
        setLoading(true);
        setError(''); // Clear any existing errors
        try {
            const response = await axios.get(
                `http://localhost:8080/api/assistant/conversation/${conversation_id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages(response.data.messages); // Load conversation messages
            setChatTitle(response.data.chat_title); // Set the chat title
            setChatProfile(response.data.chat_profile); // Set the chat profile (Career, Academics, General)
            setCreatedAt(response.data.createdAt); // Set the createdAt (conversation start date)
        } catch (error) {
            setError('Failed to fetch conversation history');
            console.error('Error fetching conversation history:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return ''; // If date is not available, return an empty string
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const parsedDate = new Date(dateString);
        return isNaN(parsedDate.getTime()) ? '' : parsedDate.toLocaleDateString(undefined, options); // Check if date is valid
    };

    const sendMessage = async () => {
        if (!userMessage.trim()) return; // Avoid sending empty messages

        const newMessage = {
            message_id: 'temp-' + new Date().getTime(),
            user: userId, 
            user_message: { content: userMessage },
            assistant_response: null
        };

        setMessages((prev) => [...prev, newMessage]);
        setUserMessage(''); // Clear input field after sending
        setLoading(true);

        try {
            const response = await axios.post(
                `http://localhost:8080/api/assistant/${conversation_id}`,
                { user_message: { content: userMessage } }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.message_id === newMessage.message_id
                        ? response.data 
                        : msg
                )
            );
        } catch (error) {
            setError('Message sending failed');
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle Enter key press for sending messages
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    const getPlaceholderText = () => {
        switch (chatProfile) {
            case 'Career':
                return `Hi ${fullName}, Confused about CDC Internships or Off campus placements? Drop your questions!`;
            case 'Academics':
                return `Hi ${fullName}, Load in academics? Need help with details on courses? Shoot your questions!`;
            case 'General':
                return `Hi ${fullName}, Any other funda you wanna know?`;
            case 'Bhaat':
                return `Hi ${fullName}, What's hot on 2.2??`;
            default:
                return 'Ask ChatKGP';
        }
    };

    return (
        <div className="conversation-container">
            <h2>
                {chatTitle || 'Conversation'}
                <span className="conversation-date">
                    {createdAt && ` - ${formatDate(createdAt)}`}
                </span>
            </h2>

            
            <div className="messages-list">
                {messages.map((msg) => (
                    <div key={msg.message_id} className="message-block">
                        <div className="message-item user-message">
                            <p>{msg.user_message.content}</p>
                        </div>
                        {msg.assistant_response ? (
                            <div className="message-item assistant-message">
                                <ReactMarkdown>{msg.assistant_response.content}</ReactMarkdown>
                            </div>
                        ) : loading ? (
                            <div className="message-item assistant-message">
                                <div className="skeleton-loader"></div>
                            </div>
                        ) : null}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="message-input">
                <input 
                    type="text" 
                    value={userMessage} 
                    onChange={(e) => setUserMessage(e.target.value)} 
                    onKeyDown={handleKeyDown} 
                    placeholder={getPlaceholderText()} 
                    disabled={loading} 
                />
                <button onClick={sendMessage} disabled={loading}>Send</button>
            </div>
        </div>
    );
};

export default Conversation;
