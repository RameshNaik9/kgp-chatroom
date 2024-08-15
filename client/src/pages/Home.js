import React, { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import '../components/Home.css'

const Home = () => {
  const [activeForm, setActiveForm] = useState(null);

  return (
    <div className="container text-center">
      <div className="row">
        <div className="col">
          <div className="text-center">
            <h2 className="typing-text">Welcome to Kgp-Chat-App</h2>
            <p>
              This is an amazing platform where you can connect and chat with Kgpians. Sign in or register to start using the platform and explore all the functionalities we offer.
            </p>
          </div>
        </div>
        <div className="col">
          <h3 className="mx-5 my-3">Web Chat</h3>
          <button
            className="btn btn-primary mb-2 mx-3"
            onClick={() => setActiveForm("login")}
          >
            Login
          </button>
          <button
            className="btn btn-secondary mb-2 mx-3"
            onClick={() => setActiveForm("signup")}
          >
            Signup
          </button>
          {activeForm === "login" && (
            <div className="card mt-3">
              <div className="card-body">
                <h5 className="card-title">Login</h5>
                <Login />
              </div>
            </div>
          )}
          {activeForm === "signup" && (
            <div className="card mt-3">
              <div className="card-body">
                <h5 className="card-title">Register</h5>
                <Signup />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
