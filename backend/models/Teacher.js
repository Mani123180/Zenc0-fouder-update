const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema(
  {
    teacherId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    empId: { type: String, required: true },
    subject: { type: String, required: true },
    qualification: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, required: true },
    classesAssigned: [{ type: String }],
    status: { type: String, enum: ['Active', 'On Leave', 'Inactive'], default: 'Active' },
    schoolId: { type: String, default: 'SCH001' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Teacher', teacherSchema);
