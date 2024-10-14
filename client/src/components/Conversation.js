import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'; // For markdown rendering
import './Conversation.css';

const Conversation = () => {
    const { conversation_id } = useParams();
    const [messages, setMessages] = useState([]);
    const [chatTitle, setChatTitle] = useState('');
    const [chatProfile, setChatProfile] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [loading, setLoading] = useState(false);
    const [userMessage, setUserMessage] = useState('');
    const [error, setError] = useState('');
    const messagesEndRef = useRef(null);
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const fullName = localStorage.getItem('fullName') || 'there';

    // Fetch conversation history on component mount
    useEffect(() => {
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

        fetchConversationHistory(); // Call the function
    }, [conversation_id, token]); // Dependency array

    // Scroll to the bottom whenever messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const parsedDate = new Date(dateString);
        return isNaN(parsedDate.getTime()) ? '' : parsedDate.toLocaleDateString(undefined, options);
    };

    const sendMessage = async () => {
        if (!userMessage.trim()) return;

        const newMessage = {
            message_id: 'temp-' + new Date().getTime(),
            user: userId, 
            user_message: { content: userMessage },
            assistant_response: null
        };

        setMessages((prev) => [...prev, newMessage]);
        setUserMessage('');
        setLoading(true);

        try {
            console.log('Sending user message to the backend:', userMessage);

            // Send HTTP request to process the user message and get final response
            const postResponse = await axios.post(
                `http://localhost:8080/api/assistant/${conversation_id}`,
                { user_message: { content: userMessage } }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Start SSE streaming
            const eventSource = new EventSource(`http://localhost:8080/api/assistant/stream-response/${conversation_id}?token=${token}`);

            eventSource.onmessage = (event) => {
                if (event.data.trim()) {
                    setMessages((prevMessages) => {
                        return prevMessages.map((msg) =>
                            msg.message_id === newMessage.message_id
                                ? {
                                    ...msg,
                                    assistant_response: {
                                        content: (msg.assistant_response?.content || '') + event.data + "\n"
                                    }
                                }
                                : msg
                        );
                    });
                }
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            };

            eventSource.onerror = (err) => {
                console.error('Error in SSE connection:', err);
                eventSource.close(); // Close SSE connection on error
            };

            eventSource.addEventListener('end', () => {
                console.log('SSE stream ended.');
                eventSource.close();  // Close SSE connection when done

                // Replace the streamed response with the final response from the post request
                setMessages((prevMessages) => {
                    return prevMessages.map((msg) =>
                        msg.message_id === newMessage.message_id
                            ? {
                                ...msg,
                                assistant_response: {
                                    content: postResponse.data.assistant_response.content // Replace with final response content
                                }
                            }
                            : msg
                    );
                });

                setLoading(false); // Stop the loading state after replacement
            });

        } catch (error) {
            console.error('Error sending message:', error);
            setError('Message sending failed');
            setLoading(false);
        }
    };


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

    const assistantLogo = '/icons/img1-icon.png'; // Reference the logo from public folder

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
                                <div className="assistant-response-container">
                                    <img src={assistantLogo} alt="Assistant Logo" className="assistant-logo" />
                                    <div className="assistant-response-content">
                                        {/* Render the assistant message progressively with ReactMarkdown */}
                                        <ReactMarkdown>{msg.assistant_response.content}</ReactMarkdown>
                                    </div>
                                </div>
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
