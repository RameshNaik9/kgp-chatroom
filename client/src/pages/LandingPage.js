import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";
// import HomePage from "./HomePage";
import '../components/LandingPage.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'https://kgp-chatroom-endhbra6fje5gxe8.southindia-01.azurewebsites.net';

const LandingPage = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
   useEffect(() => {
    let intervalId = null;
    // let toastId = null;
    let retryToastId = null;
    const checkServerStatus = () => {
      axios.get(`${apiBaseUrl}/api/health-check`)
        .then(() => {
          if (!isConnected) {
            setIsConnected(true);
            if (retryToastId) {
              toast.dismiss(retryToastId);
              retryToastId = null;
            }
            toast.success("Connected to server", { autoClose: 3000 });
          }
        })
        .catch(() => {
          if (isConnected) {
            setIsConnected(false);
          }

          if (!toast.isActive(retryToastId)) {
            retryToastId = toast.error("Connecting to server...", {
              toastId: 'connection-toast',
              autoClose: 3000,
              onClose: () => {
                setTimeout(checkServerStatus, 1000);
              }
            });
          }
        });
    };

    intervalId = setInterval(checkServerStatus, 5000);

    return () => {
      clearInterval(intervalId);
      if (retryToastId) toast.dismiss(retryToastId);
    };
  }, [isConnected]);

  return (
    <div className="container text-center">
      <ToastContainer />
      <div className="row">
        <div className="col">
          <div className="text-center">
            <h2 className="typing-text">Welcome to Kgp Chat App</h2>
            <p>
              This is an amazing platform where you can connect and chat with Kgpians. Sign in or register to start using the platform and explore all the functionalities we offer.
            </p>
          </div>
        </div>
        <div className="col">
          <h3
            className="mx-5 my-3"
            onClick={() => navigate("/home")}
            style={{ cursor: "pointer", color: "inherit"}}
          >
            Go to Web Chat
          </h3>
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

export default LandingPage;
