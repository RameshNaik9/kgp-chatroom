// ChatDrawer.js
import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ListItemIcon from '@mui/material/ListItemIcon';
import './ChatDrawer.css';
import { useNavigate } from 'react-router-dom'; 
const ChatDrawer = ({ toggleDrawer }) => {
    const chatCategories = ['Group Chat', 'Career Assistant', 'Acads Assistant', 'Gereral Assistant'];
    const navigate = useNavigate();
    const handleNavigation = (category) => {
        if (category === 'Group Chat') {
            navigate('/group-chat');  // Navigate to the General chatroom page
        }
        // Handle other categories as needed
    };

    return (
        <Box className="drawer-container" role="presentation">
            <List>
                <ListItem disablePadding>
                    {/* <ListItemButton onClick={toggleDrawer}>
                        <ListItemIcon>
                            <AddCircleOutlineIcon sx={{ color: 'black' }} />
                        </ListItemIcon>
                        <ListItemText primary="New Chat" sx={{ color: 'black' }} />
                    </ListItemButton> */}
                </ListItem>
                {chatCategories.map((category) => (
                    <ListItem key={category} disablePadding>
                        <ListItemButton onClick={() => handleNavigation(category)}>
                            <ListItemText primary={category} sx={{ color: 'black' }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default ChatDrawer;
