import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Login from './components/Login';
// import Signup from './components/Signup';
import GroupChatPage from './pages/GroupChatPage';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import CareerAssistantPage from './pages/CareerAssistantPage'; 
import PrivateRoute from './PrivateRoute';

function RoutesConfig() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/landingpage" element={<LandingPage />} />
                {/* <Route path="/login" element={<Login />} /> */}
                {/* <Route path="/signup" element={<Signup />} /> */}

                {/* Protected Routes */}
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/group-chat" element={<GroupChatPage />} />
                    
                    {/* Routes for Career Assistant */}
                    <Route path="/career-assistant" element={<CareerAssistantPage />} />
                    <Route path="/career-assistant/:conversation_id" element={<CareerAssistantPage />} />
                    <Route path="/career-assistant/archived/:conversation_id" element={<CareerAssistantPage />} />

                    {/* Add similar protected routes for other assistants if needed */}
                </Route>
            </Routes>
        </Router>
    );
}

export default RoutesConfig;
