import React, { useState } from 'react';
import Header from '../components/Header';
import ChatDrawer from '../components/ChatDrawer';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { useNavigate } from 'react-router-dom';
import HomeComponent from '../components/HomeComponent.js';


const HomePage = () => {
    const [drawerOpen, setDrawerOpen] = useState(true);
    const navigate = useNavigate();

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };
    const handleNavigation = (route) => {
        navigate(route);
    };

    return (
        <> 
           <HomeComponent/>
        </>
    );
};

export default HomePage;
