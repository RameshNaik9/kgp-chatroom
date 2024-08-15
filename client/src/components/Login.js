import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'https://kgp-chatroom-endhbra6fje5gxe8.southindia-01.azurewebsites.net'

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (email.trim() === '' || password.trim() === '') {
            alert('Please provide both username and password.');
            return;
        }
        try {
            const response = await axios.post(`${apiBaseUrl}/api/auth/login`, {
                email,
                password,
            });
            if(response && response.data.token){
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.user._id);
                navigate('/chat');
            }else{
                alert('Invalid username or password. Please try again.');
            }
        } catch (error) {
            console.error('Login failed:', error.message);
            alert('Login failed.');
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
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
