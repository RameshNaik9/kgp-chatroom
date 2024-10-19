import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './OnlineUsersComponent.css';  // Import CSS file

const socket = io(process.env.REACT_APP_SOCKET_URL);

const OnlineUsersComponent = () => {
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        // Emit the userJoined event when the component mounts
        const user = {
            userId: localStorage.getItem('userId'),
            fullName: localStorage.getItem('fullName'),
        };
        socket.emit('userJoined', user);

        // Listen for the onlineUsers event to get the list of online users
        socket.on('onlineUsers', (users) => {
            setOnlineUsers(users);
        });

        return () => {
            socket.off('onlineUsers');
            // socket.disconnect();
        };
    }, []);

    return (
        <div className="online-users-component">
            <h3>Online Users ({onlineUsers.length})</h3>
            <ul>
                {onlineUsers.map((user, index) => (
                    <li key={index}>{user.fullName}</li>
                ))}
            </ul>
        </div>
    );
};

export default OnlineUsersComponent;
