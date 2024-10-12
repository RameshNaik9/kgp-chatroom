import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Header from '../components/Header';
import ChatroomComponent from '../components/ChatComponent';
import ChatDrawer from '../components/ChatDrawer';

const GroupChatroom = () => {
    const [drawerOpen, setDrawerOpen] = useState(true);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
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
                            color:'black',
                        },
                    }}
                >
                    <ChatDrawer/>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        marginLeft: drawerOpen ? '10px' : 0,
                        marginTop: '64px',
                        transition: 'margin-left 0.3s',
                    }}
                >
                    <ChatroomComponent />
                </Box>
            </div>
        </div>
    );
};

export default GroupChatroom;