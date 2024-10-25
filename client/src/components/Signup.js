import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'https://chatkgp.azurewebsites.net';
function Signup() {
    const [rollNumber, setRollNumber] = useState('');
    const [department, setDepartment] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(''); // State for password error
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(eyeOff);

    const navigate = useNavigate();

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        // Regex pattern for strong password
        const strongPasswordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])/;

        // Check if the password meets the strong password requirements
        if (!strongPasswordPattern.test(value)) {
            setPasswordError('Strong Password Recommended!');
        } else {
            setPasswordError('');
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (passwordError) {
            toast.error('Please correct the errors before submitting.');
            return;
        }
        try {
            const response = await axios.post(`${apiBaseUrl}/api/auth/register`, {
                rollNumber,
                department,
                fullName,
                email,
                password,
            });

            if (response && response.data) {
                setRollNumber('');
                setDepartment('');
                setFullName('');
                setEmail('');
                setPassword('');

                toast.success('Registration successful!');
                navigate('/');
            } else {
                toast.error('Signup failed. Please try again.');
            }
        } catch (error) {
            console.error('Signup failed:', error.message);

            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error('An unexpected error occurred. Please try again.');
            }
        }
    };
    const handleToggle = () => {
        if (type === 'password') {
            setIcon(eye);
            setType('text');
        } else {
            setIcon(eyeOff);
            setType('password');
        }
    };

    return (
        <div className="signup-container">
            <form onSubmit={handleSignup}>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    autoComplete="name"
                />
                <input
                    type="text"
                    placeholder="Roll Number"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    required
                    autoComplete="off"
                />
                <input
                    type="email"
                    placeholder="Institute Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                />
                <input
                    type="text"
                    placeholder="Department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    autoComplete="off"
                />
                <div className="mb-4">
                <input
                   type={type}
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    autoComplete="current-password"
                />
                <span onClick={handleToggle}>
                        <Icon icon={icon} size={25} />
                </span>
                 </div>
                {passwordError && (
                    <p className="password-error mt-1 fs-14" style={{color:'red'}}>{passwordError}</p> // Display error message
                )}
               
                <button className="glow-on-hover" type="submit">Signup</button>
            </form>
            <ToastContainer toastClassName="Toastify__toast--custom" />
        </div>
    );
}

export default Signup;
