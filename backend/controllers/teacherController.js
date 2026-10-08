const Teacher = require('../models/Teacher');
const { initialTeachers } = require('../seed/seedData');
const { getDBStatus } = require('../config/db');

let memTeachers = [...initialTeachers];

const getTeachers = async (req, res) => {
  try {
    const { schoolId } = req.query;
    let query = {};
    if (schoolId) query.schoolId = schoolId;

    if (getDBStatus()) {
      const teachers = await Teacher.find(query);
      if (teachers.length > 0) return res.json({ success: true, count: teachers.length, data: teachers });
    }

    let filtered = [...memTeachers];
    if (schoolId) filtered = filtered.filter((t) => t.schoolId === schoolId);

    return res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createTeacher = async (req, res) => {
  try {
    const { name, empId, subject, qualification, phone, email, classesAssigned, schoolId } = req.body;
    if (!name || !empId || !email) {
      return res.status(400).json({ success: false, message: 'Name, Employee ID, and Email are required' });
    }

    const teacherId = 'TCH' + String(Date.now()).slice(-4);
    const newTeacher = {
      teacherId,
      name,
      empId,
      subject: subject || 'General',
      qualification: qualification || 'B.Ed.',
      phone: phone || '',
      email,
      classesAssigned: Array.isArray(classesAssigned) ? classesAssigned : ['Class 10-A'],
      status: 'Active',
      schoolId: schoolId || req.user.schoolId || 'SCH001',
    };

    if (getDBStatus()) {
      await Teacher.create(newTeacher);
    }
    memTeachers.unshift(newTeacher);

    return res.status(201).json({ success: true, message: 'Teacher added successfully', data: newTeacher });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    if (getDBStatus()) {
      const updated = await Teacher.findOneAndUpdate({ teacherId: id }, req.body, { new: true });
      if (updated) return res.json({ success: true, data: updated });
    }

    const idx = memTeachers.findIndex((t) => t.teacherId === id);
    if (idx !== -1) {
      memTeachers[idx] = { ...memTeachers[idx], ...req.body };
      return res.json({ success: true, data: memTeachers[idx] });
    }
    return res.status(404).json({ success: false, message: 'Teacher not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    if (getDBStatus()) {
      await Teacher.findOneAndDelete({ teacherId: id });
    }
    memTeachers = memTeachers.filter((t) => t.teacherId !== id);
    return res.json({ success: true, message: 'Teacher deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTeachers, createTeacher, updateTeacher, deleteTeacher };
