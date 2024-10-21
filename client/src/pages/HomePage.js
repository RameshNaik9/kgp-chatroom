import React, { useState } from 'react';
import Header from '../components/Header';
import ChatDrawer from '../components/ChatDrawer';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import img1 from '../media/robott.png';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import HomeComponent from '../components/HomeComponent';


const HomePage = () => {
    const [drawerOpen, setDrawerOpen] = useState(true);
    const navigate = useNavigate();

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const products = [
        { name: "General Chat", description: "Engage in lively discussions with your peers!", route: "/general-chat", backInfo: "Chat with Kgpians across various topics." },
        { name: "Career Assistant", description: "Get guidance on career planning and job searches.", route: "/career-assistant", backInfo: "Clarify your CDC related doubts and prepare for interviews." },
        { name: "Acads Assistant", description: "Find resources and help for your academic queries.", route: "/acads-assistant", backInfo: "Support for your coursework and research." },
        { name: "General Assistant", description: "Assistance with general inquiries and more.", route: "/general-assistant", backInfo: "Help with day-to-day inquiries and more." }
    ];

    const handleNavigation = (route) => {
        navigate(route);
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
                            top: '67px',
                            boxSizing: 'border-box',
                        },
                    }}
                >
                    <ChatDrawer />
                </Drawer>
                <Box >
                    <HomeComponent/>
                </Box>
            </div>
        </div>
    );
};

export default HomePage;
