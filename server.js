require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const { PORT, MONGODB_URI } = require('./config');
const { initSocket } = require('./services/socketService');

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');

    // Create HTTP server
    const server = http.createServer(app);

    // Initialize Socket.IO and event handlers
    initSocket(server);

    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
