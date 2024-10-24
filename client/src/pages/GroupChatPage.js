import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Header from '../components/Header';
import ChatroomComponent from '../components/ChatComponent';
import ChatDrawer from '../components/ChatDrawer';
import AdditionalComponent from '../components/AdditionalComponent';
import useMediaQuery from '@mui/material/useMediaQuery'; // Import useMediaQuery
import './GroupChatPage.css';

const GroupChatPage = () => {
    const isMobile = useMediaQuery('(max-width: 576px)'); // Check if it's mobile screen
    const [drawerOpen, setDrawerOpen] = useState(!isMobile); // Default hidden for mobile, visible for desktop
    const [additionalOpen, setAdditionalOpen] = useState(false);
    const [profileData, setProfileData] = useState(null);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const toggleAdditionalDrawer = () => {
        setAdditionalOpen(!additionalOpen);
    };

    const handleProfileClick = (profile) => {
        setProfileData(profile);
        // Open the additional drawer when a profile is clicked (for mobile)
        if (isMobile) {
            setAdditionalOpen(true);
        }
    };

    const closeProfileCard = () => {
        setProfileData(null); 
    };

    return (
        <div className="group-chat-page">
            <Header toggleDrawer={toggleDrawer} />
            <div className="group-chat-container">
                {/* Left Drawer (ChatDrawer) */}
                <Drawer
                    anchor="left"
                    open={drawerOpen}
                    onClose={toggleDrawer}
                    variant={isMobile ? 'temporary' : 'persistent'} // Temporary for mobile, persistent for desktop
                    className="chat-drawer"
                    sx={{
                        width: 250,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: 250,
                            top: '68px',
                            backgroundColor: 'transparent',
                        },
                    }}
                >
                    <ChatDrawer />
                </Drawer>

                {/* Main Chatroom */}
                <Box>
                    <ChatroomComponent onProfileClick={handleProfileClick} /> 
                </Box>

                {/* AdditionalComponent for larger screens */}
                <div className="additional-desktop">
                    <AdditionalComponent profileData={profileData} onCloseProfileCard={closeProfileCard} />
                </div>

                {/* Additional Drawer for mobile */}
                <Drawer
                    anchor="right"
                    open={additionalOpen}
                    onClose={toggleAdditionalDrawer}
                    variant="temporary"
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        width: 250,
                        '& .MuiDrawer-paper': {
                            width: 250,
                            top: '68px',
                            backgroundColor: 'transparent', // Same as desktop
                        },
                    }}
                >
                    <AdditionalComponent profileData={profileData} onCloseProfileCard={closeProfileCard} />
                </Drawer>

                {/* Toggle button for mobile */}
                <div className="toggle-additional-button" onClick={toggleAdditionalDrawer}>
                    {additionalOpen ? '<' : '>'}
                </div>
            </div>
        </div>
    );
};

export default GroupChatPage;
