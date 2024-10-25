import React, { useState, useRef } from 'react';
import './MessageBar.css';

const MessageBar = ({ onSend, loading }) => {
    const [message, setMessage] = useState('');
        const textAreaRef = useRef(null); // Ref for textarea
    
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
        <div className="message-input">
                <textarea 
                    ref={textAreaRef} // Add ref to textarea
                    value={message}
                    
                    onChange={(e) => setMessage(e.target.value)} 
                    onKeyDown={handleKeyDown} 
                    placeholder={placeholderText} // Dynamic placeholder
                    rows="1" // Start with one row
                    disabled={loading} 
                    className="textarea-input"
                    style={{ 
                        overflow: 'auto',
                        height: 'auto',  // Let the height adjust automatically
                        maxHeight: '200px' // Maximum height to avoid overly large textareas
                    }} // Ensure no scrollbars are shown
                />
                <button onClick={handleSendMessage} disabled={loading}>
                 <i className="send-icon">Send</i> 
             </button>
            </div>
    );
};

export default MessageBar;
