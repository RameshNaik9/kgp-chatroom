import React, { useState } from 'react';
import Header from '../components/Header';
import ChatDrawer from '../components/ChatDrawer';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import img1 from '../media/home_page_img_1.webp';

const HomePage = () => {
    const [drawerOpen, setDrawerOpen] = useState(true);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
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
                            top: '67px', // Adjust based on your header height
                            boxSizing: 'border-box',
                        },
                    }}
                >
                    <ChatDrawer />
                </Drawer>
                {/* Main content area */}
                <Box component="main" sx={{ flexGrow: 1, p: 1, mt: 0, ml: 0, overflow: 'auto' }}>
                    
                
                </Box>
            </div>
        </div>
    );
};

export default HomePage;
