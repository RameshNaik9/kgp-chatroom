// PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
    const isAuthenticated = !!localStorage.getItem('token'); // Check for token or any auth state

    return isAuthenticated ? <Outlet /> : <Navigate to="/landingpage" />;
};

export default PrivateRoute;
