import React, { useState, useRef, useLayoutEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './Chatroom.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import { useEffect } from 'react';

const socket = io(process.env.REACT_APP_SOCKET_URL) || 'https://kgp-chatroom-endhbra6fje5gxe8.southindia-01.azurewebsites.net';
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'https://kgp-chatroom-endhbra6fje5gxe8.southindia-01.azurewebsites.net';
const vapid_public_key=process.env.REACT_APP_VAPID_PUBLIC_KEY || 'BOMBbfvkjUBtjs49boCTJnI11Wec0CG7bp-vyVcvAclcvDfgRg2XMdwrINtOlO-S4SX5UxTiMNwAifpAEJ25wts'
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

// const subscribeUserToPush = async () => {
//     if ('serviceWorker' in navigator && 'PushManager' in window) {
//         try {
//             const registration = await navigator.serviceWorker.ready;
//             const existingSubscription = await registration.pushManager.getSubscription();

//             if (existingSubscription) {
//                 console.log('Already subscribed:', existingSubscription);

//                 await axios.post('http://localhost:8080/api/subscribe', {
//                     ...existingSubscription.toJSON(),
//                     userId,
//                 });
//                 return;
//             }

//             const subscription = await registration.pushManager.subscribe({
//                 userVisibleOnly: true,
//                 applicationServerKey: urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY),
//             });

//             await axios.post('http://localhost:8080/api/subscribe', {
//                 ...subscription.toJSON(),
//                 userId,
//             });

//             console.log('User is subscribed:', subscription);
//         } catch (error) {
//             if (Notification.permission === 'denied') {
//                 console.warn('Permission for notifications was denied');
//             } else {
//                 console.error('Failed to subscribe the user:', error);
//             }
//         }
//     }
// };

const subscribeUserToPush = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
            const registration = await navigator.serviceWorker.ready;
            const existingSubscription = await registration.pushManager.getSubscription();

            if (existingSubscription) {
                console.log('Already subscribed:', existingSubscription);

                await axios.post(`${apiBaseUrl}/api/subscribe`, {
                    ...existingSubscription.toJSON(),
                    userId,
                });
                return;
            }

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapid_public_key),
            });

            await axios.post(`${apiBaseUrl}/api/subscribe`, {
                ...subscription.toJSON(),
                userId,
            });

            console.log('User is subscribed:', subscription);
        } catch (error) {
            if (Notification.permission === 'denied') {
                console.warn('Permission for notifications was denied');
            } else {
                console.error('Failed to subscribe the user:', error);
            }
        }
    }
};

useEffect(() => {
    subscribeUserToPush();
}, []);

const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

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

            setMessage('');
            setReplyToMessage(null); 
            scrollToBottom();

            socket.emit("sendMessage", messageData, (response) => {
                if (response.status !== 'ok') {
                    toast.error('Session expired. Login again');
                }
            });
        }
    };

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const handleDeleteMessage = (messageId) => {
        socket.emit("deleteMessage", { messageId }, (response) => {
            if (response.status === "ok") {
                setMessages((prevMessages) =>
                    prevMessages.filter((msg) => msg._id !== messageId)
                );
            } else {
                toast.error('Session expired. Login again');
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
                toast.error('Session expired. Login again');
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
        msg.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`chatroom-container bg-${theme}`}>
            <ToastContainer /> 
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                <strong><h2 style={{fontSize:'18px',}} className={`m-0 ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>Group Chat</h2></strong>
                <div className=" fs-6 d-flex align-items-center">
                    <input
                        style={{borderRadius:'20px'}}
                        type="text"
                        className="form-control me-3"
                        placeholder="Search messages or users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="form-check form-switch ms-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="themeSwitch"
                            checked={theme === 'dark'}
                            onChange={toggleTheme}
                        />
                    </div>
                </div>
            </div>
            <div className={`overlay ${isConnected ? 'd-none' : 'd-flex'}`}>
                <div className="overlay-content">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className={`m-0 ${theme === 'dark' ? 'text-light' : 'text-dark'}`} >Connecting to server...</p>
                </div>
            </div>
            <div className={`messages p-3 ${isLoading ? 'blur' : ''}`} >
                {filteredMessages.map((msg, index) => {
                    const isCurrentUser = msg.user._id === userId;
                    const isEditing = editingMessageId === msg._id;
                    return (
                        <div
                            key={index}
                            className={`d-flex flex-column mb-3 ${isCurrentUser ? 'align-items-end' : 'align-items-start'}`}
                        >
                            <div className="small text-muted mb-1">
                                {msg.user.fullName} 
                                {` • ${moment(msg.createdAt).format('hh:mm A')}`}
                                {msg.isEdited && <span>(edited)</span>}
                                
                                {msg.replyTo && msg.replyTo.user && (
                                    <div className="small text-muted mb-1">
                                        Replying to: {msg.replyTo.user.fullName}
                                    </div>
                                )}
                            </div>
                            <div className="message-wrapper">
                                {msg.replyTo && (
                                    <div className={`reply-to-wrapper small p-2 rounded border ${theme === "dark" ? "text-light" : "text-dark"}`}>
                                        {msg.replyTo.message}
                                    </div>
                                )}
                                {isEditing ? (
                                    <div className="d-flex">
                                        <textarea
                                            className="form-control me-2"
                                            value={newMessageContent}
                                            onChange={(e) => setNewMessageContent(e.target.value)}
                                        />
                                        <button
                                            style={{backgroundColor:'green'}}
                                            className="btn2"
                                            onClick={() => handleEditMessageSubmit(msg._id)}
                                        >
                                            Save
                                        </button>
                                        <button
                                            style={{backgroundColor:'grey',width:'135px'}}
                                            className="btn2 ms-2"
                                            onClick={() => setEditingMessageId(null)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        className={`message-box p-2 rounded text-white ${isCurrentUser ? 'bg-primary' : 'bg-success'}`}
                                    >
                                        {msg.message}
                                        <div className="dropdown" style={{ marginRight: 'auto' }}>
                                            <button
                                                className={` dropdown-toggle ${theme === 'dark' ? 'text-light' : 'text-dark'}`}
                                                type="button"
                                                id={`dropdownMenuButton-${msg._id}`}
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end p-0" aria-labelledby={`dropdownMenuButton-${msg._id}`}>
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
                                                    <>
                                                        <li>
                                                            <a className="dropdown-item" href="#" onClick={() => handleReplyClick(msg)}>
                                                                Reply
                                                            </a>
                                                        </li>
                                                        {localStorage.getItem('fullName') === 'Admin' && (
                                                            <li>
                                                                <a className="dropdown-item" href="#" onClick={() => handleDeleteMessage(msg._id)}>
                                                                    Delete
                                                                </a>
                                                            </li>
                                                        )}
                                                    </>
                                                )}

                                                {/* // ) : (
                                                //     <li>
                                                //         <a className="dropdown-item" href="#" onClick={() => handleReplyClick(msg)}>
                                                //             Reply
                                                //         </a>
                                                //     </li>
                                                // )} */}
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
                <div className={`reply-to-container text-muted small p-2 rounded border ${theme === "dark" ? "text-light" : "text-dark"}`}>
                    <span>
                        Replying to: <strong>{replyToMessage.fullName}</strong> - {replyToMessage.message}
                    </span>
                    <div className="cancel-button">
                        <button
                            className="btn1 btn-sm"
                            onClick={() => setReplyToMessage(null)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            <div className="input-group">
                <textarea
                    className="form-control"
                    placeholder="Enter your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }}
                    style={{ resize: "none", height: "auto", overflow: "auto" }}
                    rows={1}
                />
                <button type="submit" className="btn1 btn-primary" style={{ height: "auto" }}>Send</button>
            </div>
        </form>

    </div>
);
}

export default ChatroomComponent;
