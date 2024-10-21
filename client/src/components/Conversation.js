import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import './Conversation.css';
import { FaRegThumbsUp, FaRegThumbsDown, FaRegCopy, FaSyncAlt } from 'react-icons/fa';  // Import icons

const Conversation = () => {
    const { conversation_id } = useParams();
    const [messages, setMessages] = useState([]);
    const [chatTitle, setChatTitle] = useState('');
    const [chatProfile, setChatProfile] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [loading, setLoading] = useState(false);
    const [userMessage, setUserMessage] = useState('');
    const [error, setError] = useState('');
    const [recommendedQuestions, setRecommendedQuestions] = useState([]); // New state for recommended questions
    const [isQuestionsVisible, setIsQuestionsVisible] = useState(false);  // Toggle for recommended questions
    const messagesEndRef = useRef(null);
    const textAreaRef = useRef(null); // Ref for textarea
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
                setRecommendedQuestions(response.data.recommended_questions || []); // Store recommended questions
            } catch (error) {
                setError('Failed to fetch conversation history');
                console.error('Error fetching conversation history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchConversationHistory();
    }, [conversation_id, token]);

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
            if (textAreaRef.current) {
                textAreaRef.current.style.height = 'auto'; // Reset height
            }
        }
    };

    const toggleQuestions = () => {
        setIsQuestionsVisible(!isQuestionsVisible); // Toggle visibility of recommended questions
    };

    const copyResponse = (text) => {
        navigator.clipboard.writeText(text);
        alert('Response copied!');
    };

    const handleKeyDown = (event) => {
        // Prevent form submission when pressing Enter without Shift
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage(); // Send message on Enter
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

    const assistantLogo = '/icons/img1-icon.png';

    // Function to dynamically adjust the textarea height
    const adjustTextareaHeight = () => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto'; // Reset the height to auto
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Set height based on content
        }
    };

    return (
        <div className="conversation-container">
            <h2 className='convo-title'>
                {chatTitle || 'Conversation'}
                <span className="conversation-date">
                    {createdAt && ` - ${formatDate(createdAt)}`}
                </span>
            </h2>

            <div className="messages-list">
                {messages.map((msg) => (
                    <div key={msg.message_id} className="message-block">
                        <div className="message-item user-message">
                            {msg.user_message.content}
                        </div>
                        {msg.assistant_response ? (
                            <div className="message-item assistant-message">
                                <div className="assistant-response-container">
                                    <img src={assistantLogo} alt="Assistant Logo" className="assistant-logo" />
                                    <div className="assistant-response-content">
                                        <ReactMarkdown>{msg.assistant_response.content}</ReactMarkdown>

                                        {/* Action buttons */}
                                        <div className="action-buttons">
                                            <FaRegCopy onClick={() => copyResponse(msg.assistant_response.content)} />
                                            <FaRegThumbsUp />
                                            <FaRegThumbsDown />
                                            <FaSyncAlt />
                                        </div>

                                        {/* Recommended Questions */}
                                        <div className="recommended-questions">
                                            <button onClick={toggleQuestions}>Recommended Questions</button>
                                            {isQuestionsVisible && (
                                                <ul className="questions-list">
                                                    {recommendedQuestions.map((question, idx) => (
                                                        <li key={idx}>{question}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
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
                <textarea 
                    ref={textAreaRef} // Add ref to textarea
                    value={userMessage} 
                    onChange={(e) => {
                        setUserMessage(e.target.value);
                        adjustTextareaHeight(); // Adjust height on change
                    }} 
                    onKeyDown={handleKeyDown} 
                    placeholder={getPlaceholderText()} 
                    rows="1" // Start with one row
                    disabled={loading} 
                    className="textarea-input"
                    style={{ 
                        overflow: 'auto',
                        height: 'auto',  // Let the height adjust automatically
                        maxHeight: '200px' // Maximum height to avoid overly large textareas
                    }} // Ensure no scrollbars are shown
                />
                <button onClick={sendMessage} disabled={loading}>Send</button>
            </div>
        </div>
    );
};

export default Conversation;
