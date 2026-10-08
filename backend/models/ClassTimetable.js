const mongoose = require('mongoose');

const classTimetableSchema = new mongoose.Schema(
  {
    schoolId: { type: String, default: 'SCH001' },
    grade: { type: String, required: true },
    section: { type: String, default: 'A' },
    day: { type: String, required: true },
    period: { type: Number, required: true },
    subject: { type: String, required: true },
    teacherName: { type: String, required: true },
    room: { type: String, default: 'Room 101' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClassTimetable', classTimetableSchema);
