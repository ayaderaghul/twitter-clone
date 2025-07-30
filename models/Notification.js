// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Thông báo phải có người nhận']
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Thông báo phải có người gửi']
  },
  tweet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet'
  },
  type: {
    type: String,
    enum: {
      values: ['like', 'retweet', 'reply', 'follow', 'mention'],
      message: 'Loại thông báo không hợp lệ'
    },
    required: [true, 'Thông báo phải có loại']
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes cho hiệu suất truy vấn
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
notificationSchema.index({ sender: 1 });
notificationSchema.index({ tweet: 1 });

// Virtual populate
notificationSchema.virtual('senderInfo', {
  ref: 'User',
  localField: 'sender',
  foreignField: '_id',
  justOne: true,
  options: { select: 'username name profilePicture' }
});

notificationSchema.virtual('tweetInfo', {
  ref: 'Tweet',
  localField: 'tweet',
  foreignField: '_id',
  justOne: true,
  options: { select: 'content' }
});

notificationSchema.statics.createNotification = async function({
  recipient,
  sender,
  tweet,
  type
}) {
  // Kiểm tra không tự thông báo cho chính mình
  if (recipient.toString() === sender.toString()) return null;

  const notification = await this.create({
    recipient,
    sender,
    tweet,
    type
  });

  return notification.populate('senderInfo tweetInfo');
};
notificationSchema.methods.markAsRead = async function() {
  this.read = true;
  await this.save();
  return this;
};
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;