import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import ChatDrawer from '../components/ChatDrawer';
import Assistant from '../components/Assistant';
import Conversation from '../components/Conversation';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';

const CareerAssistantPage = () => {
    const { conversation_id } = useParams();
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [newConversation, setNewConversation] = useState(null);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleNewConversation = (conversation) => {
        setNewConversation(conversation);
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
                            top: '70px',
                            boxSizing: 'border-box',
                        },
                    }}
                >
                    <ChatDrawer newConversation={newConversation} />
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 10 }}>
                    {conversation_id ? <Conversation /> : <Assistant onNewConversation={handleNewConversation} />}
                </Box>
            </div>
        </div>
    );
};

export default CareerAssistantPage;
