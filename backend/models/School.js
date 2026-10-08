const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema(
  {
    schoolId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    board: { type: String, default: 'CBSE' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    address: { type: String, default: '' },
    principalName: { type: String, default: '' },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    studentCount: { type: Number, default: 0 },
    teacherCount: { type: Number, default: 0 },
    plan: { type: String, default: 'Standard' },
    status: { type: String, enum: ['Active', 'Pending', 'Suspended'], default: 'Active' },
    joinedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('School', schoolSchema);
