const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    messageId: { type: String, unique: true },
    senderId: { type: String, required: true },
    senderName: { type: String, required: true },
    senderRole: { type: String, default: 'schooladmin' },
    receiverId: { type: String, required: true },
    receiverName: { type: String, required: true },
    receiverRole: { type: String, default: 'teacher' },
    schoolId: { type: String, default: 'SCH001' },
    text: { type: String, required: true },
    timestamp: { type: String, default: () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
