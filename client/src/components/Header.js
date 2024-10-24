import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../media/kgp-chatroom.png';
import './Header.css';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/MenuOpen';
import Avatar from '@mui/material/Avatar';
import CardContent from '@mui/material/CardContent';

const Header = ({ toggleDrawer, isDrawerOpen }) => {
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const profileCardRef = useRef(null);

    const fullName = localStorage.getItem('fullName');
    const email = localStorage.getItem('email');
    const rollNumber = localStorage.getItem('rollNumber');
    const department = localStorage.getItem('department');
    const isVerified = localStorage.getItem('isVerified') === 'true';

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const toggleProfileOpen = () => {
        setProfileOpen(prevOpen => !prevOpen);
    };

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

    // Update isMobile state on window resize
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <header className="header-class">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer}
                        className="menu-icon"
                    >
                        {/* Toggle between MenuIcon and CloseIcon based on the state of the drawer */}
                        {isDrawerOpen ? <CloseIcon /> : <MenuIcon />}
                    </IconButton>

                    <Link to="#" className="navbar-brand">
                        <img src={logo} alt="KGP Chatroom Logo" className="logo" />
                        <span>KGP Chatroom</span>
                    </Link>

                    <div className="d-flex align-items-center">
                        <Avatar 
                            alt="Profile" 
                            onClick={toggleProfileOpen} 
                            className="avatar"
                        />
                        {/* Logout button is hidden on mobile, shown on larger screens */}
                        {!isMobile && (
                            <button className="logout-btn" onClick={handleLogout}>Logout</button>
                        )}
                    </div>
                </div>
            </nav>

            {profileOpen && (
                <div className="profile-card" ref={profileCardRef}>
                    <CardContent>
                        <h5>{fullName}</h5>
                        <p>{email}</p>
                        <p>{rollNumber}</p>
                        <p>{department} Department</p>
                        <p><strong>Verified:</strong> {isVerified ? 'Yes' : 'No'}</p>
                        {isMobile && (
                            <button className="logout-btn logout-btn-mobile" onClick={handleLogout}>Logout</button>
                        )}
                        <span className="close-btn" onClick={() => setProfileOpen(false)}>&times;</span>
                    </CardContent>
                </div>
            )}
        </header>
    );
};

export default Header;
