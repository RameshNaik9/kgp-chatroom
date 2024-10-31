require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./src/db/db');
const routes = require('./src/routes');
const { errorHandler } = require('./src/middleware/errorHandler');
const { handleNewMessage } = require('./src/controllers/chatController');
// Import the archive conversations job
require('./src/jobs/archiveConversationsJob');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
const buildPath = path.join(__dirname, '../client/build');
app.use(express.static(buildPath));

// Middleware
app.use(express.json());

// CORS Middleware
app.use(cors({ origin: '*', credentials: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Routes
app.use('/api', routes);

// Health Check Route
app.get('/api/health-check', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Error Handling Middleware
app.use(errorHandler);

// // Socket.IO connection
// io.on('connection', (socket) => {
//     console.log('New client connected');
//     handleNewMessage(socket, io);

//     socket.on('disconnect', () => {
//         console.log('Client disconnected');
//     });
// });

const onlineUsers = new Map(); // Track connected users

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle new messages (existing functionality)
    handleNewMessage(socket, io);

    // Handle user joining the chat (for tracking online users)
    socket.on('userJoined', (user) => {
        console.log(`${user.fullName} has joined`);
        // Add the user to the online users map
        onlineUsers.set(socket.id, user);

        // Broadcast the updated online user list to all connected clients
        io.emit('onlineUsers', Array.from(onlineUsers.values()));  // Send the list of online users
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);

        // Remove the user from the online users map
        onlineUsers.delete(socket.id);

        // Broadcast the updated online user list to all connected clients
        io.emit('onlineUsers', Array.from(onlineUsers.values()));  // Update the user list for everyone
    });
});



// Connect to MongoDB
connectDB();

// Serve favicon
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(buildPath, 'favicon.ico'));
});
app.get('/*', (req, res) => {
  res.sendFile('index.html',{ root : buildPath});
});

// Start Server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
