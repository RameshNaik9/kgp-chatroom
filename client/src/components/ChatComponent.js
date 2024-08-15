import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './Chatroom.css';
const socket = io(process.env.REACT_APP_SOCKET_URL) || 'https://kgp-chatroom-endhbra6fje5gxe8.southindia-01.azurewebsites.net';
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'https://kgp-chatroom-endhbra6fje5gxe8.southindia-01.azurewebsites.net';

const ChatroomComponent = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(true);
    const [theme, setTheme] = useState('light');
    const messagesEndRef = useRef(null);

    const userId = localStorage.getItem('userId');

    useLayoutEffect(() => {
        axios.get(`${apiBaseUrl}/api/messages`)
            .then(response => {
                setMessages(response.data);
                setIsLoading(false);
                scrollToBottom();
            })
            .catch(error => {
                console.error('Error fetching messages:', error);
                setIsConnected(false);
            });

        socket.on('newMessage', (newMessage) => {
            setMessages(prevMessages => {
                const updatedMessages = [...prevMessages, newMessage];
                scrollToBottom();
                return updatedMessages;
            });
        });

        socket.on('connect', () => {
            setIsConnected(true);
            setIsLoading(false);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        return () => {
            socket.off('newMessage');
        };
    }, [isConnected]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
        }, 0);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();

        if (message.trim() !== '') {
            socket.emit('sendMessage', { user: userId, message: message }, (response) => {
                if (response.status === 'ok') {
                    setMessage('');
                    scrollToBottom();
                } else {
                    alert('Message not sent. Please try again.');
                }
            });
        }
    };

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className={`chatroom-container bg-${theme}`}>
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                <h2 className={`m-0 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>Chatroom</h2>
                <button className="btn btn-outline-primary" onClick={toggleTheme}>
                    Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
                </button>
            </div>
            <div className={`overlay ${isConnected ? 'd-none' : 'd-flex'}`}>
                <div className="overlay-content">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p>Connecting to server...</p>
                </div>
            </div>
            <div className={`messages p-3 ${isLoading ? 'blur' : ''}`} style={{ height: '70vh', overflowY: 'scroll' }}>
                {messages.map((msg, index) => {
                    const isCurrentUser = msg.user._id === userId;
                    return (
                        <div
                            key={index}
                            className={`d-flex flex-column mb-3 ${isCurrentUser ? 'align-items-end' : 'align-items-start'}`}
                        >
                            <div className="small text-muted mb-1">
                                {msg.user.fullName}
                            </div>
                            <div className="d-flex align-items-center">
                                <div className={`p-2 rounded text-white ${isCurrentUser ? 'bg-primary' : 'bg-success'}`}>
                                    {msg.message}
                                </div>
                                {isCurrentUser && (
                                    <span className="message-status ms-2">
                                        ✓✓
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-3 border-top">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{
                        width: 'auto',
                        maxWidth: '70%',
                        minWidth: '50px',
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'break-word',
                    }}
                    />
                    <button type="submit" className="btn btn-primary">Send</button>
                </div>
            </form>
        </div>
    );
}

export default ChatroomComponent;


