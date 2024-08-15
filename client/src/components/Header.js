import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../media/iit-kgp-logo.png';
import './Header.css'

const Header = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <Link to="/" className="d-flex align-items-center text-white text-decoration-none">
            <img className='mx-2' src={logo} alt="KGP Chatroom Logo" style={{ width: '40px', height: '40px' }} />
            <span>KGP Chatroom</span>
          </Link>
          <Link to="/" className="btn-container">
            <button className="btn1 btn-primary">Logout</button>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Header;
