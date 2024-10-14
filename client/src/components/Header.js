import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../media/iit-kgp-logo.png';
import './Header.css';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const Header = ({ toggleDrawer }) => {
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);
    const profileCardRef = useRef(null); 

    // Retrieve user data from local storage
    const fullName = localStorage.getItem('fullName');
    const email = localStorage.getItem('email');
    const rollNumber = localStorage.getItem('rollNumber');
    const department = localStorage.getItem('department');
    const isVerified = localStorage.getItem('isVerified') === 'true';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('fullName');
        localStorage.removeItem('email');
        localStorage.removeItem('rollNumber');
        localStorage.removeItem('department');
        localStorage.removeItem('isVerified');
        navigate('/');
    };

    // Toggle profile card visibility
    const toggleProfileOpen = () => {
        setProfileOpen((prevOpen) => !prevOpen);
    };

    // Close profile card when clicking outside of it
    const handleClickOutside = (event) => {
        if (profileCardRef.current && !profileCardRef.current.contains(event.target)) {
            setProfileOpen(false);
        }
    };

    useEffect(() => {
        if (profileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [profileOpen]);

    return (
        <div>
        <div className="header-class">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer}
                            sx={{ marginRight: '10px' }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </div>

                    <Link to="#" className="d-flex align-items-center justify-content-center text-white text-decoration-none" style={{ flexGrow: 1, justifyContent: 'center' }}>
                        <img className='mx-2' src={logo} alt="KGP Chatroom Logo" style={{ width: '40px', height: '40px' }} />
                        <span>KGP Chatroom</span>
                    </Link>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                            alt="Profile" 
                            onClick={toggleProfileOpen} 
                            style={{ cursor: 'pointer', marginRight: '15px' }}
                        />
                        <button className="btn1 btn-primary" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </nav>

        </div>
        <div>
            {profileOpen && (
                <div className="profile-card" ref={profileCardRef}>
                    <CardContent>
                        <h5>{fullName}</h5>
                        <p> {email}</p>
                        <p> {rollNumber}</p>
                        <p> {department} Department</p>
                        <p><strong>Verified:</strong> {isVerified ? 'Yes' : 'No'}</p>
                        <span 
                            style={{ 
                                position: 'absolute', 
                                top: '10px', 
                                right: '10px', 
                                cursor: 'pointer', 
                                fontSize: '20px',
                                color: 'white'
                            }} 
                            onClick={() => setProfileOpen(false)}
                            >
                            &times;
                    </span>
                    </CardContent>
                </div>
            )}
        </div>
        </div>
    );
};

export default Header;
