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
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [newMessageContent, setNewMessageContent] = useState("");
    const [replyToMessage, setReplyToMessage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
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
            const messageData = {
                user: userId,
                message: message,
                replyTo: replyToMessage?._id || null 
            };

            socket.emit("sendMessage", messageData, (response) => {
                if (response.status === 'ok') {
                    setMessage('');
                    setReplyToMessage(null); 
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

    const handleDeleteMessage = (messageId) => {
        socket.emit("deleteMessage", { messageId }, (response) => {
            if (response.status === "ok") {
                setMessages((prevMessages) =>
                    prevMessages.filter((msg) => msg._id !== messageId)
                );
            } else {
                alert("Message not deleted. Please try again.");
            }
        });
    };

    const handleEditMessageClick = (messageId, currentMessage) => {
        setEditingMessageId(messageId);
        setNewMessageContent(currentMessage);
    };

    const handleEditMessageSubmit = (messageId) => {
        socket.emit("editMessage", { messageId, newMessage: newMessageContent }, (response) => {
            if (response.status === "ok") {
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg._id === messageId
                            ? { ...msg, message: newMessageContent, isEdited: true }
                            : msg
                    )
                );
                setEditingMessageId(null);
                setNewMessageContent("");
            } else {
                alert("Message not edited. Please try again.");
            }
        });
    };

    const handleReplyClick = (msg) => {
        setReplyToMessage({ 
           _id: msg._id,
           fullName: msg.user.fullName,
           message: msg.message 
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    // Filter messages based on search query
    const filteredMessages = messages.filter(msg =>
        msg.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`chatroom-container bg-${theme}`}>
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                {/* <h2 className={`m-0 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>Group Chat</h2> */}
                <div className="d-flex align-items-center">
                    <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="btn btn-outline-primary me-2" style={{ width: 'auto' }} onClick={toggleTheme}>
                        Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
                    </button>
                </div>
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
                {filteredMessages.map((msg, index) => {
                    const isCurrentUser = msg.user._id === userId;
                    const isEditing = editingMessageId === msg._id;
                    return (
                        <div
                            key={index}
                            className={`d-flex flex-column mb-3 ${isCurrentUser ? 'align-items-end' : 'align-items-start'}`}
                        >
                            <div className="small text-muted mb-1">
                                {msg.user.fullName} {msg.isEdited && <span>(edited)</span>}
                            </div>
                            <div className="message-wrapper">
                                {msg.replyTo && (
                                    <div className={`small p-2 rounded border ${theme === "dark" ? "text-light" : "text-dark"}`}>
                                        Replying to: {msg.replyTo.message}
                                    </div>
                                )}
                                {isEditing ? (
                                    <div className="d-flex">
                                        <textarea
                                            className="form-control me-2"
                                            value={newMessageContent}
                                            onChange={(e) => setNewMessageContent(e.target.value)}
                                            style={{
                                                width: 'auto',
                                                maxWidth: '70%',
                                                minWidth: '50px',
                                                whiteSpace: 'pre-wrap',
                                                overflowWrap: 'break-word',
                                            }}
                                        />
                                        <button
                                            className="btn btn-success"
                                            onClick={() => handleEditMessageSubmit(msg._id)}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="btn btn-secondary ms-2"
                                            onClick={() => setEditingMessageId(null)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        className={`message-box p-2 rounded text-white ${isCurrentUser ? 'bg-primary' : 'bg-success'}`}
                                        style={{
                                            wordWrap: 'break-word',
                                            whiteSpace: 'pre-wrap',
                                            maxWidth: '90vw',
                                        }}
                                    >
                                        {msg.message}
                                        <div className="dropdown" style={{ marginRight: 'auto' }}>
                                            <button
                                                className="btn dropdown-toggle dropdown-toggle-split p-0 ml"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                                style={{ border: 'none', background: 'transparent' }}
                                            >
                                                <span className="visually-hidden">Toggle Dropdown</span>
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                {isCurrentUser ? (
                                                    <>
                                                        <li>
                                                            <a className="dropdown-item" href="#" onClick={() => handleEditMessageClick(msg._id, msg.message)}>
                                                                Edit
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a className="dropdown-item" href="#" onClick={() => handleDeleteMessage(msg._id)}>
                                                                Delete
                                                            </a>
                                                        </li>
                                                        <li>
                                                        <a className="dropdown-item" href="#" onClick={() => handleReplyClick(msg)}>
                                                            Reply
                                                        </a>
                                                    </li>
                                                    </>
                                                ) : (
                                                    <li>
                                                        <a className="dropdown-item" href="#" onClick={() => handleReplyClick(msg)}>
                                                            Reply
                                                        </a>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
        <form onSubmit={handleSendMessage} className="p-3 border-top">
            {replyToMessage && (
                <div className={`text-muted small p-2 rounded border mb-2 ${theme === "dark" ? "text-light" : "text-dark"}`}>
                    Replying to: <strong>{replyToMessage.fullName}</strong> - {replyToMessage.message} 
                    <button
                        className="btn btn-link btn-sm text-danger ms-2"
                        onClick={() => setReplyToMessage(null)}
                    >
                        Cancel
                    </button>
                </div>
            )}
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
