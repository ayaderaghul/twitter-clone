// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET, JWT_EXPIRATION} = process.env;
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Helper functions
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION
  });
};

exports.register = async (req, res, next) => {
  try {
    const { username, email, password, name } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // Tạo user mới
    const user = await User.create({
      username,
      email,
      password,
      name,
      emailVerificationToken: crypto.randomBytes(20).toString('hex')
    });

    // TODO Gửi email xác thực w sendgrid
    
    res.status(201).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
          isVerified: user.isVerified
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    console.log('here')
    const { email, password } = req.body;
    console.log(email,password)
    // Kiểm tra email và password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        code: 'INVALID_CREDENTIALS',
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // So sánh password
    // const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = await user.correctPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        code: 'INVALID_CREDENTIALS',
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Tạo tokens
    const accessToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          name: user.name,
          isVerified: user.isVerified
        },
        
        token: accessToken,
        expiresIn: JWT_EXPIRATION
        
      }
    });
  } catch (err) {
    res.status(400).json({error: 'something went wrong'});
  }
};

