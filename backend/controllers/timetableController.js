const ClassTimetable = require('../models/ClassTimetable');
const { initialTimetable } = require('../seed/seedData');
const { getDBStatus } = require('../config/db');

let memTimetable = [...initialTimetable];

const getTimetable = async (req, res) => {
  try {
    const { grade, section } = req.query;
    let query = {};
    if (grade) query.grade = grade;
    if (section) query.section = section;

    if (getDBStatus()) {
      const timetable = await ClassTimetable.find(query);
      if (timetable.length > 0) return res.json({ success: true, data: timetable });
    }

    let filtered = [...memTimetable];
    if (grade) filtered = filtered.filter((t) => t.grade === grade);
    if (section) filtered = filtered.filter((t) => t.section === section);

    return res.json({ success: true, data: filtered });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateTimetableSlot = async (req, res) => {
  try {
    const { grade, section, day, period, subject, teacherName, room } = req.body;
    if (!grade || !day || !period || !subject) {
      return res.status(400).json({ success: false, message: 'Grade, day, period, and subject are required' });
    }

    const slotData = {
      schoolId: req.user ? req.user.schoolId : 'SCH001',
      grade,
      section: section || 'A',
      day,
      period: Number(period),
      subject,
      teacherName: teacherName || '',
      room: room || 'Room 101',
    };

    if (getDBStatus()) {
      await ClassTimetable.findOneAndUpdate(
        { grade, section: slotData.section, day, period: slotData.period },
        slotData,
        { upsert: true, new: true }
      );
    }

    const idx = memTimetable.findIndex(
      (t) => t.grade === grade && t.section === slotData.section && t.day === day && t.period === slotData.period
    );
    if (idx !== -1) {
      memTimetable[idx] = slotData;
    } else {
      memTimetable.push(slotData);
    }

    return res.json({ success: true, message: 'Timetable slot updated successfully', data: slotData });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTimetable, updateTimetableSlot };
