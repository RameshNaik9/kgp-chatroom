import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import ChatDrawer from '../components/ChatDrawer';
import Assistant from '../components/Assistant';
import Conversation from '../components/Conversation';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';

const CareerAssistantPage = () => {
    const { conversation_id } = useParams(); // Get conversation_id from URL
    const [drawerOpen, setDrawerOpen] = useState(true);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Header toggleDrawer={toggleDrawer} />
            <div style={{ display: 'flex', flexGrow: 1 }}>
                <Drawer
                    anchor="left"
                    open={drawerOpen}
                    onClose={toggleDrawer}
                    variant="persistent"
                    sx={{
                        width: 250,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: 250,
                            top: '70px', // Adjust based on your header height
                            boxSizing: 'border-box',
                            height: 'calc(100vh - 70px)', // Full height, but excluding the header
                            overflowY: 'auto', // Independent scrolling for the chat drawer
                        },
                    }}
                >
                    <ChatDrawer />
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        mt:10,
                        p: 3,
                        overflowY: 'auto', // Independent scrolling for the main content
                        height: 'calc(100vh - 70px)', // Make it occupy the remaining height excluding the header
                    }}
                >
                    {conversation_id ? <Conversation /> : <Assistant />}
                </Box>
            </div>
        </div>
    );
};

export default CareerAssistantPage;
