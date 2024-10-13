import React, { useState, useEffect } from 'react';
import './MessageBar.css';

const MessageBar = ({ onSend, loading }) => {
    const [message, setMessage] = useState('');
    
    // Personalized greeting based on stored user name
    const fullName = localStorage.getItem('fullName') || 'there';
    const placeholderText = `Hi ${fullName}, ask me anything!`;

    const handleSendMessage = () => {
        if (message.trim()) {
            onSend(message);
            setMessage(''); // Clear the input after sending
        }
    };

    // Handle Enter key press for sending messages
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="message-bar">
            <input 
                type="text" 
                placeholder={placeholderText} // Dynamic placeholder
                value={message}
                onChange={(e) => setMessage(e.target.value)} 
                onKeyDown={handleKeyDown} // Listen for Enter key press
                disabled={loading} // Disable input during loading
            />
            <button onClick={handleSendMessage} disabled={loading}>
                <i className="send-icon">Send</i> {/* Optional: You can add an icon here */}
            </button>
        </div>
    );
};

export default MessageBar;
