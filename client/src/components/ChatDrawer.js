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

const ChatDrawer = ({ open, toggleDrawer }) => {
    const chatCategories = ['General', 'Announcements', 'FAQ', 'Support'];

    return (
        <Box 
            className="drawer-container" 
            sx={{ 
                width: open ? 250 : 0, 
                overflow: open ? 'visible' : 'hidden',
                backgroundColor: 'white' , // Setting background color to white
                Color:'black'
            }} 
            role="presentation"
        >
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={toggleDrawer}>
                        <ListItemIcon><AddCircleOutlineIcon /></ListItemIcon>
                        <ListItemText primary="New Chat" />
                    </ListItemButton>
                </ListItem>
                {chatCategories.map((category) => (
                    <ListItem key={category} disablePadding>
                        <ListItemButton onClick={toggleDrawer}>
                            <ListItemText primary={category} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default ChatDrawer;
