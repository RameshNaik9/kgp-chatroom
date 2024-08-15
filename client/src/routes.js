import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import ChatPage from './pages/ChatPage';
import Home from './pages/Home';

function RoutesConfig() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/" element={<Home />} />
            </Routes>
        </Router>
    );
}

export default RoutesConfig;
