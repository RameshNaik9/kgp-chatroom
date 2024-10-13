import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse'; // For collapsible menu
import './ChatDrawer.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // To fetch conversations
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'; // Icon for collapsing

const ChatDrawer = ({ toggleDrawer }) => {
    const navigate = useNavigate();
    
    const [allConversations, setAllConversations] = useState([]); // Store all conversations
    const [isCareerOpen, setIsCareerOpen] = useState(false); // Toggle visibility for Career Assistant
    const [isAcademicsOpen, setIsAcademicsOpen] = useState(false); // Toggle visibility for Academics Assistant
    const [isGeneralOpen, setIsGeneralOpen] = useState(false); // Toggle visibility for General Assistant

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

    // Filter conversations based on chat_profile
    const careerConversations = allConversations.filter(conversation => conversation.chat_profile === 'career');
    const academicsConversations = allConversations.filter(conversation => conversation.chat_profile === 'academics');
    const generalConversations = allConversations.filter(conversation => conversation.chat_profile === 'general');

    // Toggle menus
    const toggleCareerMenu = () => setIsCareerOpen(!isCareerOpen);
    const toggleAcademicsMenu = () => setIsAcademicsOpen(!isAcademicsOpen);
    const toggleGeneralMenu = () => setIsGeneralOpen(!isGeneralOpen);

    const handleNavigation = (category, conversationId = null) => {
        if (conversationId) {
            navigate(`/${category}/${conversationId}`); // Navigate to the selected conversation
        } else {
            navigate(`/${category}`); // Navigate to the Assistant page (Career, Academics, General)
        }
    };

    return (
        <Box className="drawer-container" role="presentation">
            <List>

                {/* Group Chat */}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => handleNavigation('group-chat')}>
                        <ListItemText primary="Group Chat" sx={{ color: 'white' }} />
                    </ListItemButton>
                </ListItem>

                {/* Career Assistant */}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => handleNavigation('career-assistant')}>
                        <ListItemText primary="Career Assistant" sx={{ color: 'white' }} />
                    </ListItemButton>
                    {/* Toggle Button */}
                    <ArrowDropDownIcon
                        onClick={toggleCareerMenu}
                        sx={{ color: 'white', cursor: 'pointer' }}
                    />
                </ListItem>
                <Collapse in={isCareerOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {careerConversations.map(conversation => (
                            <ListItem key={conversation._id} disablePadding sx={{ pl: 4 }}>
                                <ListItemButton onClick={() => handleNavigation('career-assistant', conversation._id)}>
                                    <ListItemText primary={conversation.chat_title} sx={{ color: 'white' }} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Collapse>

                {/* Academics Assistant */}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => handleNavigation('academics-assistant')}>
                        <ListItemText primary="Acads Assistant" sx={{ color: 'white' }} />
                    </ListItemButton>
                    <ArrowDropDownIcon
                        onClick={toggleAcademicsMenu}
                        sx={{ color: 'white', cursor: 'pointer' }}
                    />
                </ListItem>
                <Collapse in={isAcademicsOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {academicsConversations.map(conversation => (
                            <ListItem key={conversation._id} disablePadding sx={{ pl: 4 }}>
                                <ListItemButton onClick={() => handleNavigation('academics-assistant', conversation._id)}>
                                    <ListItemText primary={conversation.chat_title} sx={{ color: 'white' }} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Collapse>

                {/* General Assistant */}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => handleNavigation('general-assistant')}>
                        <ListItemText primary="General Assistant" sx={{ color: 'white' }} />
                    </ListItemButton>
                    <ArrowDropDownIcon
                        onClick={toggleGeneralMenu}
                        sx={{ color: 'white', cursor: 'pointer' }}
                    />
                </ListItem>
                <Collapse in={isGeneralOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {generalConversations.map(conversation => (
                            <ListItem key={conversation._id} disablePadding sx={{ pl: 4 }}>
                                <ListItemButton onClick={() => handleNavigation('general-assistant', conversation._id)}>
                                    <ListItemText primary={conversation.chat_title} sx={{ color: 'white' }} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Collapse>

            </List>
        </Box>
    );
};

export default ChatDrawer;
