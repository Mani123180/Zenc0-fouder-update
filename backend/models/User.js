const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    role: {
      type: String,
      enum: ['superadmin', 'schooladmin', 'principal', 'teacher', 'student', 'parent'],
      required: true,
    },
    schoolId: { type: String, default: 'SCH001' },
    schoolName: { type: String, default: 'Zenith International Girls Higher Secondary School' },
    status: { type: String, enum: ['Active', 'Inactive', 'Suspended'], default: 'Active' },
    avatar: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
