import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert'; // Three dots icon
import './ChatDrawer.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChatDrawer = ({ toggleDrawer, newConversation }) => {
    const navigate = useNavigate();
    const [allConversations, setAllConversations] = useState([]);
    const [selectedAssistant, setSelectedAssistant] = useState('');
    const [selectedConversation, setSelectedConversation] = useState('');
    const [showHistory, setShowHistory] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentConversationId, setCurrentConversationId] = useState(null); // Track the clicked conversation
    const open = Boolean(anchorEl);

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

    useEffect(() => {
        if (newConversation) {
            setAllConversations(prevConversations => [...prevConversations, newConversation]);
        }
    }, [newConversation]);

    const handleAssistantClick = (category) => {
        const assistantMap = {
            'career-assistant': 'Career',
            'academics-assistant': 'Academics',
            'general-assistant': 'General',
            'group-chat': 'Group'
        };

        const selectedProfile = assistantMap[category];
        setSelectedAssistant(selectedProfile);
        navigate(`/${category}`);

        if (category !== 'group-chat') {
            setTimeout(() => setShowHistory(true), 200);
        } else {
            setShowHistory(false);
        }
    };

    const handleConversationClick = (category, conversationId) => {
        setSelectedConversation(conversationId); // Set the active conversation
        navigate(`/${category}/${conversationId}`);
    };

    const handleMenuClick = (event, conversationId) => {
        event.stopPropagation(); // Stop the propagation to prevent triggering the conversation click
        setAnchorEl(event.currentTarget);
        setCurrentConversationId(conversationId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setCurrentConversationId(null);
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8080/api/assistant/conversation/${currentConversationId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setAllConversations(prevConversations => prevConversations.filter(c => c._id !== currentConversationId));
        } catch (error) {
            console.error('Error deleting conversation:', error);
        } finally {
            handleMenuClose();
        }
    };

    return (
        <Box className="drawer-container" role="presentation">
            <List>
                <ListItem disablePadding>
                    <ListItemButton 
                        onClick={() => handleAssistantClick('group-chat')}
                        className={selectedAssistant === 'Group' ? 'active-item' : ''} 
                    >
                        <ListItemText primary="Group Chat" sx={{ color: 'white' }} />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => handleAssistantClick('career-assistant')}
                        className={selectedAssistant === 'Career' ? 'active-item' : ''}
                    >
                        <ListItemText primary="Career Assistant" sx={{ color: 'white' }} />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => handleAssistantClick('academics-assistant')}
                        className={selectedAssistant === 'Academics' ? 'active-item' : ''}
                    >
                        <ListItemText primary="Acads Assistant" sx={{ color: 'white' }} />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => handleAssistantClick('general-assistant')}
                        className={selectedAssistant === 'General' ? 'active-item' : ''}
                    >
                        <ListItemText primary="General Assistant" sx={{ color: 'white' }} />
                    </ListItemButton>
                </ListItem>

                {showHistory && (
                    <>
                        <ListItem disablePadding>
                            <ListItemText primary="History" sx={{ color: 'white', paddingLeft: '16px', marginTop: '16px' }} />
                        </ListItem>
                        {allConversations
                            .filter(conversation => conversation.chat_profile === selectedAssistant)
                            .map(conversation => (
                                <ListItem 
                                    key={conversation._id} 
                                    disablePadding 
                                    sx={{ pl: 1 }}
                                    className={selectedConversation === conversation._id ? 'active-item' : ''}
                                >
                                    <ListItemButton onClick={() => handleConversationClick(selectedAssistant.toLowerCase() + '-assistant', conversation._id)}>
                                        <ListItemText 
                                            primary={conversation.chat_title}
                                            sx={{ color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                        />
                                        <IconButton 
                                            size="small" 
                                            onClick={(e) => handleMenuClick(e, conversation._id)} 
                                            aria-label="more"
                                            sx={{ color: 'white' }}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                    </>
                )}
            </List>

            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <MenuItem onClick={() => console.log('Rename clicked')}>Rename</MenuItem>
                <MenuItem onClick={() => console.log('Archive clicked')}>Archive</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
        </Box>
    );
};

export default ChatDrawer;
