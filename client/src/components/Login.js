import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
// import './ToastStyles.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'https://kgp-chatroom-endhbra6fje5gxe8.southindia-01.azurewebsites.net'

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (email.trim() === '' || password.trim() === '') {
            toast.error('Please provide both email and password.');
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
                toast.success('Login successful!');
                navigate('/chat');
            }else{
                toast.error('Invalid email or password. Please try again.');
            }
        } catch (error) {
            console.error('Login failed:', error.message);
            toast.error('Invalid Credentials');
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
                <button className='but' type="submit">Login</button>
            </form>
            <ToastContainer toastClassName="Toastify__toast--custom" />
        </div>
    );
}

export default Login;
