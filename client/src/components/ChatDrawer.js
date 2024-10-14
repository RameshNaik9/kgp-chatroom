// import React, { useState, useEffect } from 'react';
// import Box from '@mui/material/Box';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemText from '@mui/material/ListItemText';
// import './ChatDrawer.css';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const ChatDrawer = ({ toggleDrawer, newConversation }) => {
//     const navigate = useNavigate();

//     const [allConversations, setAllConversations] = useState([]); // Store all conversations
//     const [selectedAssistant, setSelectedAssistant] = useState(''); // Track which assistant is clicked
//     const [selectedConversation, setSelectedConversation] = useState(''); // Track the active conversation
//     const [showHistory, setShowHistory] = useState(false); // Toggle history visibility

//     // Fetch all conversations when the component mounts
//     useEffect(() => {
//         const fetchAllConversations = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 const response = await axios.get(`http://localhost:8080/api/assistant/conversations`, {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 setAllConversations(response.data);
//             } catch (error) {
//                 console.error('Error fetching conversations:', error);
//             }
//         };

//         fetchAllConversations();
//     }, []);

//     // Update conversation list dynamically when new conversation is added
//     useEffect(() => {
//         if (newConversation) {
//             setAllConversations(prevConversations => [...prevConversations, newConversation]);
//         }
//     }, [newConversation]);

//     // Filter conversations based on selected assistant
//     const filteredConversations = allConversations.filter(conversation => conversation.chat_profile === selectedAssistant);

//     const handleAssistantClick = (category) => {
//         const assistantMap = {
//             'career-assistant': 'Career',
//             'academics-assistant': 'Academics',
//             'general-assistant': 'General',
//             'group-chat': 'Group' // Add Group Chat to the map
//         };

//         const selectedProfile = assistantMap[category];
//         setSelectedAssistant(selectedProfile);

//         // Redirect to the assistant page first
//         navigate(`/${category}`);

//         // Show the history after redirection, except for 'Group Chat'
//         if (category !== 'group-chat') {
//             setTimeout(() => {
//                 setShowHistory(true);
//             }, 200); // 200ms delay to ensure smooth transition after navigation
//         } else {
//             setShowHistory(false);
//         }
//     };

//     const handleConversationClick = (category, conversationId) => {
//         setSelectedConversation(conversationId); // Set the active conversation
//         navigate(`/${category}/${conversationId}`); // Navigate to the selected conversation
//     };

//     return (
//         <Box className="drawer-container" role="presentation">
//             <List>
//                 {/* Group Chat */}
//                 <ListItem disablePadding>
//                     <ListItemButton 
//                         onClick={() => handleAssistantClick('group-chat')}
//                         className={selectedAssistant === 'Group' ? 'active-item' : ''} // Check if the assistant is selected
//                     >
//                         <ListItemText primary="Group Chat" sx={{ color: 'white' }} />
//                     </ListItemButton>
//                 </ListItem>

//                 {/* Career Assistant */}
//                 <ListItem disablePadding>
//                     <ListItemButton
//                         onClick={() => handleAssistantClick('career-assistant')}
//                         className={selectedAssistant === 'Career' ? 'active-item' : ''} // Check if Career Assistant is selected
//                     >
//                         <ListItemText primary="Career Assistant" sx={{ color: 'white' }} />
//                     </ListItemButton>
//                 </ListItem>

//                 {/* Academics Assistant */}
//                 <ListItem disablePadding>
//                     <ListItemButton
//                         onClick={() => handleAssistantClick('academics-assistant')}
//                         className={selectedAssistant === 'Academics' ? 'active-item' : ''} // Check if Academics Assistant is selected
//                     >
//                         <ListItemText primary="Acads Assistant" sx={{ color: 'white' }} />
//                     </ListItemButton>
//                 </ListItem>

//                 {/* General Assistant */}
//                 <ListItem disablePadding>
//                     <ListItemButton
//                         onClick={() => handleAssistantClick('general-assistant')}
//                         className={selectedAssistant === 'General' ? 'active-item' : ''} // Check if General Assistant is selected
//                     >
//                         <ListItemText primary="General Assistant" sx={{ color: 'white' }} />
//                     </ListItemButton>
//                 </ListItem>

//                 {/* History Section */}
//                 {showHistory && (
//                     <>
//                         <ListItem disablePadding>
//                             <ListItemText primary="History" sx={{ color: 'white', paddingLeft: '16px', marginTop: '16px' }} />
//                         </ListItem>
//                         {filteredConversations.map(conversation => (
//                             <ListItem 
//                                 key={conversation._id} 
//                                 disablePadding 
//                                 sx={{ pl: 1 }}
//                                 className={selectedConversation === conversation._id ? 'active-item' : ''}
//                             >
//                                 <ListItemButton onClick={() => handleConversationClick(selectedAssistant.toLowerCase() + '-assistant', conversation._id)}>
//                                     <ListItemText 
//                                         primary={conversation.chat_title} 
//                                         sx={{ 
//                                             color: 'white',
//                                             whiteSpace: 'nowrap',
//                                             overflow: 'hidden',
//                                             textOverflow: 'ellipsis'
//                                         }} 
//                                     />
//                                 </ListItemButton>
//                             </ListItem>
//                         ))}
//                     </>
//                 )}
//             </List>

//         </Box>
//     );
// };

// export default ChatDrawer;

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

    // For the three-dot menu
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentConversationId, setCurrentConversationId] = useState(null); // To track the clicked conversation
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
        setSelectedConversation(conversationId);
        navigate(`/${category}/${conversationId}`);
    };

    const handleMenuClick = (event, conversationId) => {
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
                    <ListItemButton onClick={() => handleAssistantClick('group-chat')}>
                        <ListItemText primary="Group Chat" sx={{ color: 'white' }} />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton onClick={() => handleAssistantClick('career-assistant')}>
                        <ListItemText primary="Career Assistant" sx={{ color: 'white' }} />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton onClick={() => handleAssistantClick('academics-assistant')}>
                        <ListItemText primary="Acads Assistant" sx={{ color: 'white' }} />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton onClick={() => handleAssistantClick('general-assistant')}>
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
                                <ListItem key={conversation._id} disablePadding sx={{ pl: 1 }}>
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

            {/* Three-dot menu for conversation actions */}
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                <MenuItem onClick={() => console.log('Rename clicked')}>Rename</MenuItem>
                <MenuItem onClick={() => console.log('Archive clicked')}>Archive</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
        </Box>
    );
};

export default ChatDrawer;
