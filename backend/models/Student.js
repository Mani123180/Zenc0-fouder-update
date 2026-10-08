const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    rollNo: { type: String, required: true },
    grade: { type: String, required: true },
    section: { type: String, default: 'A' },
    gender: { type: String, default: 'Female' },
    dob: { type: String, default: '' },
    parentName: { type: String, default: '' },
    parentPhone: { type: String, default: '' },
    parentEmail: { type: String, default: '' },
    address: { type: String, default: '' },
    attendancePercentage: { type: Number, default: 95 },
    feeStatus: { type: String, enum: ['Paid', 'Pending', 'Partial'], default: 'Paid' },
    schoolId: { type: String, default: 'SCH001' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
