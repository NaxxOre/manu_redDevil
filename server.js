const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Create an Express app
const app = express();

// Create an HTTP server
const server = http.createServer(app);

// Set up Socket.IO with CORS configuration
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "https://united-red-devil.vercel.app/"], // Allow multiple origins
    methods: ["GET", "POST"],
  },
});

// In-memory storage for messages per room
const roomMessages = {};  // Save messages for each room

// Example route for /
app.get('/', (req, res) => {
  res.send('Welcome to the chat application!');
});

// When a user connects to the socket server
io.on('connection', (socket) => {
  console.log('A user connected');

  // Join the user to a specific room
  socket.on('joinRoom', (room) => {
    console.log(`User joined room: ${room}`);
    socket.join(room);

    // Send all previous messages to the user who joined
    if (roomMessages[room]) {
      socket.emit('previousMessages', roomMessages[room]);
    }
  });

  // Listen for chat messages and broadcast to the specific room
  socket.on('chatMessage', (room, msg) => {
    console.log(`Received message in room ${room}: ${msg}`);

    // Save the message in the roomMessages object
    if (!roomMessages[room]) {
      roomMessages[room] = [];
    }
    roomMessages[room].push(msg);

    // Emit the message to all clients in the room, including the sender
    io.to(room).emit('chatMessage', msg);
  });

  // When the user disconnects
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Use the PORT environment variable or default to 3001
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on http://localhost:${PORT}`);
});