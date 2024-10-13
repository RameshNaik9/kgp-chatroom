import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import './ChatDrawer.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChatDrawer = ({ toggleDrawer, newConversation }) => {
    const navigate = useNavigate();

    const [allConversations, setAllConversations] = useState([]); // Store all conversations
    const [selectedAssistant, setSelectedAssistant] = useState(''); // Track which assistant is clicked
    const [showHistory, setShowHistory] = useState(false); // Toggle history visibility

    // Fetch all conversations when the component mounts
    useEffect(() => {
        const fetchAllConversations = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8080/api/assistant/conversations`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAllConversations(response.data);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };

        fetchAllConversations();
    }, []);

    // Update conversation list dynamically when new conversation is added
    useEffect(() => {
        if (newConversation) {
            setAllConversations(prevConversations => [...prevConversations, newConversation]);
        }
    }, [newConversation]);

    // Filter conversations based on selected assistant
    const filteredConversations = allConversations.filter(conversation => conversation.chat_profile === selectedAssistant);

    const handleAssistantClick = (category) => {
        const assistantMap = {
            'career-assistant': 'Career',
            'academics-assistant': 'Academics',
            'general-assistant': 'General'
        };

        const selectedProfile = assistantMap[category];
        setSelectedAssistant(selectedProfile);

        // Redirect to the assistant page first
        navigate(`/${category}`);

        // Show the history after redirection
        setTimeout(() => {
            setShowHistory(true);
        }, 200); // 200ms delay to ensure smooth transition after navigation
    };

    const handleConversationClick = (category, conversationId) => {
        navigate(`/${category}/${conversationId}`); // Navigate to the selected conversation
    };

    return (
        <Box className="drawer-container" role="presentation">
            <List>
                {/* Group Chat */}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate('/group-chat')}>
                        <ListItemText primary="Group Chat" sx={{ color: 'white' }} />
                    </ListItemButton>
                </ListItem>

                {/* Career Assistant */}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => handleAssistantClick('career-assistant')}>
                        <ListItemText primary="Career Assistant" sx={{ color: 'white' }} />
                    </ListItemButton>
                </ListItem>

                {/* Academics Assistant */}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => handleAssistantClick('academics-assistant')}>
                        <ListItemText primary="Acads Assistant" sx={{ color: 'white' }} />
                    </ListItemButton>
                </ListItem>

                {/* General Assistant */}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => handleAssistantClick('general-assistant')}>
                        <ListItemText primary="General Assistant" sx={{ color: 'white' }} />
                    </ListItemButton>
                </ListItem>

                {/* History Section */}
                {showHistory && (
                    <>
                        <ListItem disablePadding>
                            <ListItemText primary="History" sx={{ color: 'white', paddingLeft: '16px', marginTop: '16px' }} />
                        </ListItem>
                        {filteredConversations.map(conversation => (
                            <ListItem key={conversation._id} disablePadding sx={{ pl: 4 }}>
                                <ListItemButton onClick={() => handleConversationClick(selectedAssistant.toLowerCase() + '-assistant', conversation._id)}>
                                    <ListItemText 
                                        primary={conversation.chat_title} 
                                        sx={{ 
                                            color: 'white',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }} 
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </>
                )}
            </List>
        </Box>
    );
};

export default ChatDrawer;
