import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../media/iit-kgp-logo.png'

const Header = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            <img className='mx-2' src={logo} alt="KGP Chatroom Logo" style={{ width: '40px', height: '40px' }} />
            KGP Chatroom
          </Link>
          <form className="d-flex" role="search">
            <Link to="/">
              <button className="btn btn-primary mx-2" type="button">Logout</button>
            </Link>
          </form>
        </div>
      </nav>
    </div>
  )
}

export default Header
