// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';

// const Conversation = () => {
//     const { conversation_id } = useParams(); // Get conversation_id from URL
//     const [messages, setMessages] = useState([]); // Store the conversation messages
//     const [loading, setLoading] = useState(false);
//     const [userMessage, setUserMessage] = useState('');

//     const token = localStorage.getItem('token');

//     // Fetch the conversation history on component mount
//     useEffect(() => {
//         const fetchConversationHistory = async () => {
//             try {
//                 setLoading(true);

//                 console.log(`Fetching conversation history for ID: ${conversation_id}`);

//                 const response = await axios.get(
//                     `http://localhost:8080/api/assistant/conversation/${conversation_id}`,
//                     { headers: { Authorization: `Bearer ${token}` } }
//                 );

//                 console.log('Conversation history fetched:', response.data);

//                 setMessages(response.data.messages); // Store the fetched conversation messages
//             } catch (error) {
//                 console.error('Error fetching conversation history:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         // Call the function to fetch conversation history
//         fetchConversationHistory();
//     }, [conversation_id, token]);

//     const sendMessage = async () => {
//         if (!userMessage.trim()) {
//             console.log('Message is empty. Not sending request.');
//             return; // Avoid sending empty messages
//         }

//         setLoading(true); // Show loading while waiting for assistant response

//         try {
//             // Make API call to send the user message
//             const response = await axios.post(
//                 `http://localhost:8080/api/assistant/${conversation_id}`,
//                 { user_message: { content: userMessage } },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             console.log('API Response:', response.data);

//             // Append the new message to the conversation
//             setMessages((prev) => [...prev, response.data]);
//         } catch (error) {
//             console.error('Error sending message:', error);
//         } finally {
//             setLoading(false); // Hide loading after response
//             setUserMessage(''); // Clear input field after sending
//         }
//     };

//     return (
//         <div className="conversation-container">
//             <h2>Conversation Component</h2>
//             <div className="messages-list">
//                 {messages.map((msg) => (
//                     <div key={msg.message_id} className="message-item">
//                         <p><strong>You:</strong> {msg.user_message.content}</p>
//                         {msg.assistant_response?.content && (
//                             <p><strong>Assistant:</strong> {msg.assistant_response.content}</p>
//                         )}
//                     </div>
//                 ))}
//             </div>

//             {loading && <p>Waiting for assistant response...</p>}

//             <div className="message-input">
//                 <input 
//                     type="text" 
//                     value={userMessage} 
//                     onChange={(e) => setUserMessage(e.target.value)} 
//                     placeholder="Type your message..." 
//                 />
//                 <button onClick={sendMessage}>Send</button>
//             </div>
//         </div>
//     );
// };

// export default Conversation;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom'; // Use useLocation to get initial message

const Conversation = () => {
    const { conversation_id } = useParams(); // Get conversation_id from URL
    const location = useLocation(); // Get initialMessage from state when a new conversation starts
    const [messages, setMessages] = useState([]); // Store conversation messages
    const [loading, setLoading] = useState(false); // Loading state
    const [userMessage, setUserMessage] = useState(''); // Message input
    const initialMessage = location.state?.initialMessage || ''; // Retrieve initial message from location state if present

    const token = localStorage.getItem('token');

    // Fetch conversation history on component mount (for refresh or revisit)
    useEffect(() => {
        if (initialMessage) {
            // If we are starting a new conversation, handle the initial message
            handleInitialMessage();
        } else {
            // If we're revisiting or refreshing, fetch the conversation history
            fetchConversationHistory();
        }
    }, [conversation_id]);

    // Fetch existing conversation history
    const fetchConversationHistory = async () => {
        setLoading(true);
        try {
            console.log('Fetching conversation history');
            const response = await axios.get(
                `http://localhost:8080/api/assistant/conversation/${conversation_id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages(response.data.messages); // Load conversation messages
        } catch (error) {
            console.error('Error fetching conversation history:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle sending initial message when starting a new conversation
    const handleInitialMessage = async () => {
        if (initialMessage) {
            console.log('Sending initial message:', initialMessage);
            // Add initial message to the conversation
            setMessages((prev) => [
                ...prev,
                {
                    message_id: 'initial',
                    user_message: { content: initialMessage },
                    assistant_response: { content: '' } // Placeholder for assistant response
                }
            ]);

            // Fetch assistant's response to the initial message
            await getAssistantResponse(initialMessage);
        }
    };

    // Function to fetch the assistant's response for the initial message
    const getAssistantResponse = async (message) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `http://localhost:8080/api/assistant/${conversation_id}`,
                { user_message: { content: message } }, // Send user message as payload
                { headers: { Authorization: `Bearer ${token}` } } // Attach Bearer token
            );

            // Append the assistant's response to the initial message
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages];
                updatedMessages[updatedMessages.length - 1].assistant_response.content = response.data.assistant_response.content;
                return updatedMessages;
            });
        } catch (error) {
            console.error('Error fetching assistant response:', error);
        } finally {
            setLoading(false);
        }
    };

    // Send user message to assistant in an ongoing conversation
    const sendMessage = async () => {
        if (!userMessage.trim()) {
            console.log('Message is empty. Not sending request.');
            return; // Avoid sending empty messages
        }

        setLoading(true); // Show loading while waiting for assistant response

        try {
            const response = await axios.post(
                `http://localhost:8080/api/assistant/${conversation_id}`,
                { user_message: { content: userMessage } }, // Send user message as payload
                { headers: { Authorization: `Bearer ${token}` } } // Attach Bearer token
            );

            // Append the new message to the conversation
            setMessages((prev) => [...prev, response.data]);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false); // Hide loading after response
            setUserMessage(''); // Clear input field after sending
        }
    };

    return (
        <div className="conversation-container">
            <h2>Conversation Component</h2>
            <div className="messages-list">
                {messages.map((msg) => (
                    <div key={msg.message_id} className="message-item">
                        <p><strong>You:</strong> {msg.user_message.content}</p>
                        {msg.assistant_response?.content && (
                            <p><strong>Assistant:</strong> {msg.assistant_response.content}</p>
                        )}
                    </div>
                ))}
            </div>

            {loading && <p>Waiting for assistant response...</p>}

            <div className="message-input">
                <input 
                    type="text" 
                    value={userMessage} 
                    onChange={(e) => setUserMessage(e.target.value)} 
                    placeholder="Type your message..." 
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Conversation;
