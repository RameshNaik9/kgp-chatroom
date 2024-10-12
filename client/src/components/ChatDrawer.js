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

const ChatDrawer = ({ toggleDrawer }) => {
    const chatCategories = ['General', 'Announcements', 'FAQ', 'Support'];

    return (
        <Box className="drawer-container" role="presentation">
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={toggleDrawer}>
                        <ListItemIcon>
                            <AddCircleOutlineIcon sx={{ color: 'black' }} />
                        </ListItemIcon>
                        <ListItemText primary="New Chat" sx={{ color: 'black' }} />
                    </ListItemButton>
                </ListItem>
                {chatCategories.map((category) => (
                    <ListItem key={category} disablePadding>
                        <ListItemButton onClick={toggleDrawer}>
                            <ListItemText primary={category} sx={{ color: 'black' }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default ChatDrawer;
