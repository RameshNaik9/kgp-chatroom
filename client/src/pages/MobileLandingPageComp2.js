import React, { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import './MobileLandingPageComp2.css'; // Import the CSS file

const MobileLandingPageComp2 = () => {
  const [activeForm, setActiveForm] = useState(null);

  return (
    <div className="mobile-auth-container">
      <button
        className="mobile-auth-button"
        onClick={() => setActiveForm("login")}
      >
        Login
      </button>
      <button
        className="mobile-auth-button"
        onClick={() => setActiveForm("signup")}
      >
        Signup
      </button>

      {activeForm === "login" && (
        <div className="mobile-card">
          <h5>Login</h5>
          <Login />
        </div>
      )}
      {activeForm === "signup" && (
        <div className="mobile-card">
          <h5>Register</h5>
          <Signup />
        </div>
      )}
    </div>
  );
};

export default MobileLandingPageComp2;
