import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
// import './ToastStyles.css';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'https://kgp-chatroom-endhbra6fje5gxe8.southindia-01.azurewebsites.net'

function Signup() {
    const [rollNumber, setRollNumber] = useState('');
    const [department, setDepartment] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiBaseUrl}/api/auth/register`, {
                rollNumber,
                department,
                fullName,
                email,
                password,
            });
            if(response){
                setRollNumber('');
                setDepartment('');
                setFullName('');
                setEmail('');
                setPassword('');
                
                toast.success('Registration Success');
                navigate('/');
            }else{
                toast.error('Signup failed');
            }
        } catch (error) {
            console.error('Signup failed:', error.message);
            toast.error('Signup failed.');
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
                    autoComplete="name" /* Helps with autofill for full name */
                />
                <input
                    type="text"
                    placeholder="Roll Number"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    required
                    autoComplete="off" /* Disable autofill for roll number */
                />
                <input
                    type="email"
                    placeholder="Institute Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username" /* Set email as username */
                />
                <input
                    type="text"
                    placeholder="Department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    autoComplete="off" /* Disable autofill for department */
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password" /* Set password field */
                />
                <button className='but' type="submit">Signup</button>
            </form>
            <ToastContainer toastClassName="Toastify__toast--custom" />
        </div>
    );
}

export default Signup;
