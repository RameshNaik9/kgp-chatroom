// HomePage.js
import React, { useState } from 'react';
import Header from '../components/Header';
import ChatDrawer from '../components/ChatDrawer';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

const HomePage = () => {
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
                        },
                    }}
                >
                    <ChatDrawer />
                </Drawer>
                {/* Your main content area */}
                <Box component="main" sx={{ flexGrow: 1, p: 1,mt:0,ml:0,backgroundColor:'red' }}>
                    <h1>Welcome to the Home Page</h1>
                    {/* Other main content here */}
                </Box>
            </div>
        </div>
    );
};

export default HomePage;
