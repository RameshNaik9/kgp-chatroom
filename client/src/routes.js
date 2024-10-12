import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import GeneralChatPage from './pages/GeneralChatPage';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
function RoutesConfig() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/general" element={<GeneralChatPage />} />
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<HomePage />} />
            </Routes>
        </Router>
    );
}

export default RoutesConfig;
