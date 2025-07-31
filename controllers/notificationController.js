// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Get user notifications
exports.getNotifications = async (req, res, next ) => {
    try {
    const notifications = await Notification.find({
      recipient: req.user.id
    })
    .sort({ createdAt: -1 })
    .limit(20)
    .populate('sender', 'username profilePicture')
    .populate('tweet', 'content');
    console.log('inside backend getnotif', notifications)
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Mark as read
exports.markRead = async (req,res,next) => {
    try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { $set: { read: true } },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

