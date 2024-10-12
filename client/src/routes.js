import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import ChatPage from './pages/ChatPage';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
function RoutesConfig() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/" element={<LandingPage />} />
                <Route path="/Home" element={<HomePage />} />
            </Routes>
        </Router>
    );
}

export default RoutesConfig;
