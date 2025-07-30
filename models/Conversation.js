const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    validate: {
      validator: function(participants) {
        return participants.length >= 2 && participants.length <= 20; // Giới hạn nhóm chat 20 người
      },
      message: 'Hội thoại phải có ít nhất 2 người tham gia và tối đa 20 người'
    }
  }],
  isGroup: {
    type: Boolean,
    default: false
  },
  groupName: {
    type: String,
    trim: true
  },
  groupPhoto: {
    type: String
  },
  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Middleware tự động cập nhật updatedAt
conversationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes
conversationSchema.index({ participants: 1, updatedAt: -1 });
conversationSchema.index({ isGroup: 1 });
conversationSchema.statics.findOrCreateConversation = async function(participants) {
  // Kiểm tra hội thoại 1-1 đã tồn tại chưa
  if (participants.length === 2) {
    const existingConv = await this.findOne({
      participants: { $all: participants },
      isGroup: false
    }).populate('lastMessage');
    
    if (existingConv) return existingConv;
  }

  // Tạo hội thoại mới
  const newConversation = await this.create({
    participants,
    isGroup: participants.length > 2
  });
  
  return newConversation;
};
const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;