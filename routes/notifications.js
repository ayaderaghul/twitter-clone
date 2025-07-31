// // routes/notifications.js

const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const {authMiddleware} = require('../middlewares/authMiddleware');



router.get('/', authMiddleware, notificationController.getNotifications);
router.patch('/:notificationId/read', authMiddleware, notificationController.markRead);
// router.get('/unread-count', authMiddleware, notificationController.getUnreadCount);
// router.delete('/:notificationId', authMiddleware, notificationController.deleteNotification);


module.exports = router;
