// HomePage.js
import React, { useState } from 'react';
import Header from '../components/Header';
import ChatDrawer from '../components/ChatDrawer';

const HomePage = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Header toggleDrawer={toggleDrawer} />
            <ChatDrawer open={drawerOpen} toggleDrawer={toggleDrawer} />
            <main style={{ flexGrow: 1 }}>
                {/* Main content here */}
            </main>
        </div>
    );
};

export default HomePage;
