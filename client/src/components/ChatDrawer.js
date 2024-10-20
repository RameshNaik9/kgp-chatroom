import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import './ChatDrawer.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const ChatDrawer = ({ toggleDrawer, newConversation }) => {
    const navigate = useNavigate();
    const [allConversations, setAllConversations] = useState([]); // Store all conversations
    const [selectedAssistant, setSelectedAssistant] = useState(''); // Track which assistant is clicked
    const [selectedConversation, setSelectedConversation] = useState(''); // Track the active conversation
    const [careerOpen, setCareerOpen] = useState(false); // Toggle career history visibility

    // Fetch all conversations when the component mounts
    useEffect(() => {
        const fetchAllConversations = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8080/api/assistant/conversations`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAllConversations(response.data.reverse()); // Reverse to have the latest at the top
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };
        fetchAllConversations();
    }, []);

    // Update conversation list dynamically when new conversation is added
    useEffect(() => {
        if (newConversation) {
            setAllConversations(prevConversations => [newConversation, ...prevConversations]);
        }
    }, [newConversation]);

    // Filter conversations based on selected assistant
    const filteredConversations = allConversations.filter(conversation => conversation.chat_profile === selectedAssistant);

    const handleAssistantClick = async (category) => {
        const assistantMap = {
            'career-assistant': 'Career',
            'academics-assistant': 'Academics',
            'general-assistant': 'General',
            'group-chat': 'Group' // Add Group Chat to the map
        };
        const selectedProfile = assistantMap[category];
        setSelectedAssistant(selectedProfile);
        setSelectedConversation(''); // Clear selected conversation on new assistant selection

        if (category === 'career-assistant') {
            setCareerOpen(prevOpen => !prevOpen); // Toggle the career history visibility
        } else {
            setCareerOpen(false);
        }

        navigate(`/${category}`, { replace: true });
    };

    const handleConversationClick = (category, conversationId) => {
        setSelectedConversation(conversationId); // Set the active conversation
        navigate(`/${category}/${conversationId}`); // Navigate to the selected conversation
    };

    return (
        <Box className="drawer-container" role="presentation">
            <List>
                {/* Group Chat */}
                <ListItem disablePadding>
                    <ListItemButton 
                        onClick={() => handleAssistantClick('group-chat')}
                        className={selectedAssistant === 'Group' ? 'active-item' : ''} // Check if the assistant is selected
                    >
                        <ListItemText primary="Group Chat" sx={{ color: 'white' }} />
                    </ListItemButton>
                </ListItem>
                {/* Career Assistant */}
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => handleAssistantClick('career-assistant')}
                        className={selectedAssistant === 'Career' ? 'active-item' : ''} // Check if Career Assistant is selected
                    >
                        <ListItemText primary="Career Assistant" sx={{ color: 'white' }} />
                        {careerOpen ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
                    </ListItemButton>
                </ListItem>
                <Collapse in={careerOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding className="history-list">
                        {/* New Chat Button */}
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    setSelectedConversation(''); // Reset selected conversation
                                    navigate('/career-assistant'); // Navigate to the new chat route
                                }}
                                className="new-conversation-btn"
                            >
                                <ListItemText primary="New Chat" sx={{ color: 'white' }} />
                            </ListItemButton>
                        </ListItem>
                        {/* History */}
                        {filteredConversations.map(conversation => (
                            <ListItem 
                                key={conversation._id} 
                                disablePadding 
                                sx={{ pl: 4 }}
                                className={selectedConversation === conversation._id ? 'active-item' : ''}
                            >
                                <ListItemButton onClick={() => handleConversationClick('career-assistant', conversation._id)}>
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
                    </List>
                </Collapse>
                {/* Academics Assistant */}
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => handleAssistantClick('academics-assistant')}
                        className={selectedAssistant === 'Academics' ? 'active-item' : ''} // Check if Academics Assistant is selected
                    >
                        <ListItemText primary="Acads Assistant" sx={{ color: 'white' }} />
                    </ListItemButton>
                </ListItem>
                {/* General Assistant */}
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => handleAssistantClick('general-assistant')}
                        className={selectedAssistant === 'General' ? 'active-item' : ''} // Check if General Assistant is selected
                    >
                        <ListItemText primary="General Assistant" sx={{ color: 'white' }} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );
};

export default ChatDrawer;
