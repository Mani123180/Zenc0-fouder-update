const Student = require('../models/Student');
const { initialStudents } = require('../seed/seedData');
const { getDBStatus } = require('../config/db');

let memStudents = [...initialStudents];

const getStudents = async (req, res) => {
  try {
    const { schoolId, grade } = req.query;
    let query = {};
    if (schoolId) query.schoolId = schoolId;
    if (grade) query.grade = grade;

    if (getDBStatus()) {
      const students = await Student.find(query);
      if (students.length > 0) return res.json({ success: true, count: students.length, data: students });
    }

    let filtered = [...memStudents];
    if (schoolId) filtered = filtered.filter((s) => s.schoolId === schoolId);
    if (grade) filtered = filtered.filter((s) => s.grade === grade);

    return res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createStudent = async (req, res) => {
  try {
    const { name, rollNo, grade, section, gender, dob, parentName, parentPhone, parentEmail, address, feeStatus, schoolId } = req.body;
    if (!name || !rollNo || !grade) {
      return res.status(400).json({ success: false, message: 'Name, Roll No, and Grade are required' });
    }

    const studentId = 'STD' + String(Date.now()).slice(-4);
    const newStudent = {
      studentId,
      name,
      rollNo,
      grade,
      section: section || 'A',
      gender: gender || 'Female',
      dob: dob || '',
      parentName: parentName || '',
      parentPhone: parentPhone || '',
      parentEmail: parentEmail || '',
      address: address || '',
      attendancePercentage: 100,
      feeStatus: feeStatus || 'Paid',
      schoolId: schoolId || req.user.schoolId || 'SCH001',
    };

    if (getDBStatus()) {
      await Student.create(newStudent);
    }
    memStudents.unshift(newStudent);

    return res.status(201).json({ success: true, message: 'Student enrolled successfully', data: newStudent });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (getDBStatus()) {
      const updated = await Student.findOneAndUpdate({ studentId: id }, req.body, { new: true });
      if (updated) return res.json({ success: true, data: updated });
    }

    const idx = memStudents.findIndex((s) => s.studentId === id);
    if (idx !== -1) {
      memStudents[idx] = { ...memStudents[idx], ...req.body };
      return res.json({ success: true, data: memStudents[idx] });
    }
    return res.status(404).json({ success: false, message: 'Student not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const linkParent = async (req, res) => {
  try {
    const { studentId, parentName, parentPhone, parentEmail } = req.body;
    if (!studentId || !parentName || !parentPhone) {
      return res.status(400).json({ success: false, message: 'Student ID, parent name, and phone are required' });
    }

    if (getDBStatus()) {
      const updated = await Student.findOneAndUpdate(
        { studentId },
        { parentName, parentPhone, parentEmail },
        { new: true }
      );
      if (updated) return res.json({ success: true, message: 'Parent successfully linked to student', data: updated });
    }

    const idx = memStudents.findIndex((s) => s.studentId === studentId);
    if (idx !== -1) {
      memStudents[idx] = { ...memStudents[idx], parentName, parentPhone, parentEmail: parentEmail || memStudents[idx].parentEmail };
      return res.json({ success: true, message: 'Parent successfully linked to student', data: memStudents[idx] });
    }
    return res.status(404).json({ success: false, message: 'Student not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (getDBStatus()) {
      await Student.findOneAndDelete({ studentId: id });
    }
    memStudents = memStudents.filter((s) => s.studentId !== id);
    return res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStudents, createStudent, updateStudent, linkParent, deleteStudent };
