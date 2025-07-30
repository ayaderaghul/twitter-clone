// middlewares/validateRegisterAdvanced.js
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const validateRegister = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username là bắt buộc')
    .isLength({ min: 3, max: 20 }).withMessage('Username phải từ 3-20 ký tự')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username chỉ chứa chữ cái, số và dấu gạch dưới')
    .custom(async (username) => {
      const user = await User.findOne({ username });
      if (user) {
        throw new Error('Username đã tồn tại');
      }
    }),

  body('email')
    .trim()
    .notEmpty().withMessage('Email là bắt buộc')
    .isEmail().withMessage('Email không hợp lệ')
    .normalizeEmail()
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new Error('Email đã được đăng ký');
      }
    }),

  body('password')
    .notEmpty().withMessage('Mật khẩu là bắt buộc')
    .isLength({ min: 6 }).withMessage('Mật khẩu tối thiểu 6 ký tự')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/).withMessage('Mật khẩu phải chứa ít nhất 1 chữ cái và 1 số'),

  body('passwordConfirm')
    .notEmpty().withMessage('Xác nhận mật khẩu là bắt buộc')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Mật khẩu xác nhận không khớp');
      }
      return true;
    }),

  async (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().reduce((acc, err) => {
        acc[err.param] = acc[err.param] || [];
        acc[err.param].push(err.msg);
        return acc;
      }, {});

      return res.status(400).json({
        code: 'REGISTRATION_VALIDATION_FAILED',
        message: 'Dữ liệu đăng ký không hợp lệ',
        errors: formattedErrors
      });
    }

    next();
  }
];

module.exports = validateRegister;