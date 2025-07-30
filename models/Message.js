const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: [true, 'Tin nhắn phải thuộc một hội thoại']
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Tin nhắn phải có người gửi']
  },
  content: {
    type: String,
    trim: true,
    maxlength: [2000, 'Tin nhắn tối đa 2000 ký tự']
  },
  media: [{
    url: String,
    mediaType: {
      type: String,
      enum: ['image', 'video', 'file'],
      default: 'image'
    },
    filename: String,
    size: Number
  }],
  readBy: [{
    reader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['sent', 'delivered', 'seen'],
    default: 'sent'
  },
  deletedFor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
messageSchema.index({ conversation: 1, createdAt: 1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ status: 1 });

// Virtual populate
messageSchema.virtual('senderInfo', {
  ref: 'User',
  localField: 'sender',
  foreignField: '_id',
  justOne: true,
  options: { select: 'username name profilePicture' }
});
messageSchema.methods.markAsSeen = async function(userId) {
  if (!this.readBy.some(r => r.reader.equals(userId))) {
    this.readBy.push({ reader: userId });
    this.status = 'seen';
    await this.save();
  }
  return this;
};
const Message = mongoose.model('Message', messageSchema);
module.exports = Message;