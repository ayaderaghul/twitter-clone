const socketIo = require('socket.io');
const Notification = require('../models/Notification');

let io;
const activeUsers = {};

const initSocket = (server) => {
  io = socketIo(server, {
    cors: { origin: 'http://localhost:5173', credentials: true }
  });

  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    socket.on('register', (userId) => {
      activeUsers[userId] = socket.id;
      console.log('✅ Registered user:', userId);
    });

    socket.on('disconnect', () => {
      const userId = Object.keys(activeUsers).find(
        id => activeUsers[id] === socket.id
      );
      delete activeUsers[userId];
      console.log('❌ Client disconnected:', socket.id);
    });
  });
};

const getIo = () => io;

const sendNotification = async (userId, data) => {
  try {
    const notification = await Notification.create({
      recipient: userId,
      ...data
    });

    const populated = await Notification.populate(notification, [
      { path: 'sender', select: 'username profilePicture' },
      { path: 'tweet', select: 'content' }
    ]);

    const socketId = activeUsers[userId];
    if (socketId && io) {
      io.to(socketId).emit('notification', populated);
    }

    return populated;
  } catch (error) {
    console.error('Notification error:', error);
  }
};

module.exports = { initSocket, getIo, sendNotification };
