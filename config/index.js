require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/twitter-clone',
    TEST_MONGODB_URI: process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/twitter-clone',
    JWT_SECRET: process.env.JWT_SECRET || 'sekret',
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1d',
}