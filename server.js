require('dotenv').config();
const app = require('./app');

const mongoose = require('mongoose');

const { PORT, MONGODB_URI } = require('./config');

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  })
  .finally(() => {
    console.log('MongoDB connection attempt finished');
  });
