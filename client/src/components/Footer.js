import React from 'react';
import './Footer.css';
// import { GrInstagram, GrFacebook } from 'react-icons/gr';
// import { BsTwitter, BsLinkedin, BsGithub } from 'react-icons/bs';
// import { FaSnapchatGhost } from 'react-icons/fa';

const getCurrentYear = () => {
  return new Date().getFullYear();
};

const Footer = () => {
  return (
    <footer>
      {/* <a href="#" className='footer__logo'>RAMESH</a> */}

      <div className="footer__copyright">
        <small>&copy; KGP Chatroom. All Rights Reserved  {getCurrentYear()}</small>
      </div>
    </footer>
  );
};

export default Footer;
