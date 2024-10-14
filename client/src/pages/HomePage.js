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
import '../components/HomePage.css';

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
                <Box 
                    component="main" 
                    sx={{ 
                        flexGrow: 1, 
                        position: 'relative',
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center', 
                        overflow: 'auto',
                        padding: 3
                    }}
                >
                    <div className="typing-animation" s>
                        Chat Smarter, Not Harder
                    </div>
                    <img 
                        src={img1} 
                        alt="KGP Chatroom Robot" 
                        style={{ 
                            maxHeight: '300px',
                            width: 'auto',
                            objectFit: 'contain',
                            position: 'absolute',
                            top: '20%',
                            zIndex: 1
                        }} 
                    />
                    <Box sx={{ position: 'absolute', top: '50%', width: '100%', display: 'flex', justifyContent: 'space-around', marginTop: 10 }}>
                        {products.map(product => (
                            <div className="flip-card">
                                <div className="flip-card-inner">
                                    <div className="flip-card-front">
                                        <Card 
                                            key={product.name}
                                            sx={{
                                                width: '200px',
                                                minHeight: '140px',
                                                borderRadius: '20px',
                                                boxShadow: 3,
                                            }}
                                        >
                                            <CardContent className= "fst-italic" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                <Typography variant="h5" component="div" sx={{ textAlign: 'center', whiteSpace: 'nowrap', textOverflow: 'ellipsis'  }}>
                                                    {product.name}
                                                </Typography>
                                                <Typography variant="body2" sx={{ textAlign: 'center' }}>
                                                    {product.description}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </div>
                                    <div className="flip-card-back fst-italic">
                                        <Card 
                                            key={product.name + '-back'}
                                            sx={{
                                                width: '200px',
                                                minHeight: '140px',
                                                borderRadius: '20px',
                                                boxShadow: 3,
                                                backgroundColor: '#f1f1f1',
                                            }}
                                        >
                                            <CardContent className= "fst-italic"sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                <Typography variant="h6" component="div" sx={{ textAlign: 'center', color: '#333', }}>
                                                    {product.backInfo}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Box>
                </Box>
            </div>
        </div>
    );
};

export default HomePage;
