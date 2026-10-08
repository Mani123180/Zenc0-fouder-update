const mongoose = require('mongoose');

const contactInquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    subject: { type: String, default: 'General Inquiry' },
    message: { type: String, required: true },
    status: { type: String, enum: ['New', 'In Progress', 'Resolved'], default: 'New' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactInquiry', contactInquirySchema);
