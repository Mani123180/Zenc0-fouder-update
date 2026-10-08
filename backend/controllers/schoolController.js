const School = require('../models/School');
const { initialSchools } = require('../seed/seedData');
const { getDBStatus } = require('../config/db');

let memSchools = [...initialSchools];

const getSchools = async (req, res) => {
  try {
    if (getDBStatus()) {
      const schools = await School.find();
      if (schools.length > 0) return res.json({ success: true, count: schools.length, data: schools });
    }
    return res.json({ success: true, count: memSchools.length, data: memSchools });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getSchoolById = async (req, res) => {
  try {
    const { id } = req.params;
    let school = null;
    if (getDBStatus()) {
      school = await School.findOne({ schoolId: id });
    }
    if (!school) {
      school = memSchools.find((s) => s.schoolId === id);
    }
    if (!school) {
      return res.status(404).json({ success: false, message: 'School not found' });
    }
    return res.json({ success: true, data: school });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createSchool = async (req, res) => {
  try {
    const { name, code, board, city, state, address, principalName, email, phone, plan } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'School name and email are required' });
    }

    const schoolId = 'SCH' + String(Date.now()).slice(-4);
    const newSchool = {
      schoolId,
      name,
      code: code || `SCH-${Math.floor(10 + Math.random() * 90)}`,
      board: board || 'CBSE',
      city: city || 'Chennai',
      state: state || 'Tamil Nadu',
      address: address || '',
      principalName: principalName || '',
      email,
      phone: phone || '',
      studentCount: 0,
      teacherCount: 0,
      plan: plan || 'Standard',
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    if (getDBStatus()) {
      await School.create(newSchool);
    }
    memSchools.unshift(newSchool);

    return res.status(201).json({ success: true, message: 'School onboarded successfully', data: newSchool });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateSchool = async (req, res) => {
  try {
    const { id } = req.params;
    if (getDBStatus()) {
      const updated = await School.findOneAndUpdate({ schoolId: id }, req.body, { new: true });
      if (updated) return res.json({ success: true, data: updated });
    }
    const idx = memSchools.findIndex((s) => s.schoolId === id);
    if (idx !== -1) {
      memSchools[idx] = { ...memSchools[idx], ...req.body };
      return res.json({ success: true, data: memSchools[idx] });
    }
    return res.status(404).json({ success: false, message: 'School not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteSchool = async (req, res) => {
  try {
    const { id } = req.params;
    if (getDBStatus()) {
      await School.findOneAndDelete({ schoolId: id });
    }
    memSchools = memSchools.filter((s) => s.schoolId !== id);
    return res.json({ success: true, message: 'School deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSchools, getSchoolById, createSchool, updateSchool, deleteSchool };
