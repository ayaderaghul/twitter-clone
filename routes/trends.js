// // routes/trends.js

const express = require('express');
const router = express.Router();
const trendController = require('../controllers/trendController');
const {authMiddleware} = require('../middlewares/authMiddleware');



router.get('/weekly-trend', authMiddleware, trendController.getWeeklyTrend);

module.exports = router;
