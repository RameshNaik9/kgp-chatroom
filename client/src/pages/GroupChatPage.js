import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Header from '../components/Header';
import ChatroomComponent from '../components/ChatComponent';
import ChatDrawer from '../components/ChatDrawer';
import AdditionalComponent from '../components/AdditionalComponent';
import './GroupChatPage.css';

const GroupChatPage = () => {
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [profileData, setProfileData] = useState(null);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleProfileClick = (profile) => {
        setProfileData(profile); 
    };

    const closeProfileCard = () => {
        setProfileData(null); 
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
                            width: 250,
                            top: '68px',
                            // boxSizing: 'border-box',
                            color: 'white',
                        },
                    }}
                >
                    <ChatDrawer />
                </Drawer>

                <Box>
                    <ChatroomComponent onProfileClick={handleProfileClick} /> 
                </Box>

                <AdditionalComponent profileData={profileData} onCloseProfileCard={closeProfileCard} /> 
            </div>
        </div>
    );
};

export default GroupChatPage;
