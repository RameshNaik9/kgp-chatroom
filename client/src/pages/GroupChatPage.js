import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Header from '../components/Header';
import ChatroomComponent from '../components/ChatComponent';
import ChatDrawer from '../components/ChatDrawer';
import AdditionalComponent from '../components/AdditionalComponent';
import './ChatPage.css';

const GroupChatroom = () => {
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [profileData, setProfileData] = useState(null); // Manage profile state

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleProfileClick = (profile) => {
        setProfileData(profile);  // Update profile data when clicked
    };

    return (
        <div className="group-chat-page">
            <Header toggleDrawer={toggleDrawer} />
            <div className="group-chat-container">
                <Drawer
                    anchor="left"
                    open={drawerOpen}
                    onClose={toggleDrawer}
                    variant="persistent"
                    className="chat-drawer"
                    sx={{
                        width: 250,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: 240,
                            top: '68px',
                            boxSizing: 'border-box',
                            color: 'white',
                        },
                    }}
                >
                    <ChatDrawer />
                </Drawer>

                <Box
                    component="main"
                    className={`chatroom-container ${drawerOpen ? 'with-drawer' : 'without-drawer'}`}
                >
                    <ChatroomComponent onProfileClick={handleProfileClick} /> {/* Pass handler */}
                </Box>

                <AdditionalComponent profileData={profileData} />  {/* Pass profileData */}
            </div>
        </div>
    );
};

export default GroupChatroom;
