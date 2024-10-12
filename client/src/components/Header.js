import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../media/iit-kgp-logo.png';
import './Header.css';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

const Header = ({ toggleDrawer }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
    navigate('/');
  };

  return (
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
            <button className="btn1 btn-primary" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
