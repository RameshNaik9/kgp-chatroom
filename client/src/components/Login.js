import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'https://kgp-chatroom-endhbra6fje5gxe8.southindia-01.azurewebsites.net';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(eyeOff);

    const navigate = useNavigate();

    const handleToggle = () => {
        if (type === 'password') {
            setIcon(eye);
            setType('text');
        } else {
            setIcon(eyeOff);
            setType('password');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (email.trim() === '' || password.trim() === '') {
            toast.error('Please provide both email and password.');
            return;
        }
        try {
            const response = await axios.post(`${apiBaseUrl}/api/auth/login`, { email, password });
            if (response && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.user._id);
                toast.success('Login successful!');
                navigate('/chat');
            } else {
                toast.error('Invalid email or password. Please try again.');
            }
        } catch (error) {
            console.error('Login failed:', error.message);
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="login-container">
            <form autoComplete="on" onSubmit={handleLogin}>
                <input
                    type="email"
                    id="email"
                    placeholder="Institute Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                />
                <div className="mb-3">
                    <input
                        type={type}
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                    <span onClick={handleToggle}>
                        <Icon icon={icon} size={25} />
                    </span>
                </div>
                <button className="but" type="submit">Login</button>
            </form>
            <ToastContainer toastClassName="Toastify__toast--custom" />
        </div>
    );
}

export default Login;
