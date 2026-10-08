const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    planId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    billingCycle: { type: String, enum: ['Monthly', 'Quarterly', 'Annual'], default: 'Annual' },
    maxStudents: { type: Number, default: 500 },
    maxTeachers: { type: Number, default: 50 },
    features: [{ type: String }],
    status: { type: String, enum: ['Active', 'Archived'], default: 'Active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Plan', planSchema);
