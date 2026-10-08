const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    subscriptionId: { type: String, unique: true, required: true },
    schoolId: { type: String, required: true },
    schoolName: { type: String, required: true },
    planName: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Expiring Soon', 'Expired'], default: 'Active' },
    startDate: { type: String, required: true },
    expiryDate: { type: String, required: true },
    amount: { type: Number, required: true },
    billingCycle: { type: String, default: 'Annual' },
    autoRenew: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);
