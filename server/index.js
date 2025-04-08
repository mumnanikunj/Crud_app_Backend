const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // adjust for security in prod
    methods: ['GET', 'POST']
  }
});

io.on('connection', socket => {
  console.log('New client connected:', socket.id);

  socket.on('join', roomId => {
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', socket.id);
  });

  socket.on('offer', ({ roomId, offer }) => {
    socket.to(roomId).emit('receive-offer', { offer, senderId: socket.id });
  });

  socket.on('answer', ({ roomId, answer }) => {
    socket.to(roomId).emit('receive-answer', { answer, senderId: socket.id });
  });

  socket.on('ice-candidate', ({ roomId, candidate }) => {
    socket.to(roomId).emit('receive-candidate', { candidate, senderId: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(5000, () => console.log('Server running on port 5000'));
