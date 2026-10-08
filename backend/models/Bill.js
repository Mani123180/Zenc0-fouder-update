const mongoose = require('mongoose');

const billSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, unique: true, required: true },
    schoolName: { type: String, required: true },
    planName: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    status: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Paid' },
    paymentMethod: { type: String, default: 'Net Banking' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bill', billSchema);
