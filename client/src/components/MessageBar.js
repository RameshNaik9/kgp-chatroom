import React, { useState } from 'react';

const MessageBar = ({ onSend }) => {
    const [message, setMessage] = useState('');

    const handleSendMessage = () => {
        if (message.trim()) {
            onSend(message);
            setMessage(''); // Clear the input after sending
        }
    };

    return (
        <div className="message-bar">
            <input 
                type="text" 
                placeholder="Type your message..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)} 
            />
            <button onClick={handleSendMessage}>
                <i className="send-icon">Send</i> {/* You can style this icon */}
            </button>
        </div>
    );
};

export default MessageBar;
