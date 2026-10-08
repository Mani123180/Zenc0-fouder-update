const User = require('../models/User');
const { initialUsers } = require('../seed/seedData');
const { getDBStatus } = require('../config/db');

let memUsers = [...initialUsers];

const getUsers = async (req, res) => {
  try {
    const { schoolId, role } = req.query;
    let query = {};
    if (schoolId && schoolId !== 'ALL') query.schoolId = schoolId;
    if (role) query.role = role;

    if (getDBStatus()) {
      const users = await User.find(query).select('-password');
      if (users.length > 0) return res.json({ success: true, count: users.length, data: users });
    }

    let filtered = [...memUsers];
    if (schoolId && schoolId !== 'ALL') {
      filtered = filtered.filter((u) => u.schoolId === schoolId || u.schoolId === 'ALL');
    }
    if (role) {
      filtered = filtered.filter((u) => u.role === role);
    }

    const safeUsers = filtered.map(({ password, ...rest }) => rest);
    return res.json({ success: true, count: safeUsers.length, data: safeUsers });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, password, name, email, phone, role, schoolId, schoolName } = req.body;
    if (!username || !name || !email || !role) {
      return res.status(400).json({ success: false, message: 'Username, name, email and role are required' });
    }

    const userId = 'USR' + String(Date.now()).slice(-4);
    const newUser = {
      userId,
      username: username.toLowerCase().trim(),
      password: password || 'Welcome@123',
      name,
      email,
      phone: phone || '',
      role,
      schoolId: schoolId || req.user.schoolId || 'SCH001',
      schoolName: schoolName || req.user.schoolName || 'Zenith International Girls Higher Secondary School',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    };

    if (getDBStatus()) {
      await User.create(newUser);
    }
    memUsers.unshift(newUser);

    const { password: _, ...userSafe } = newUser;
    return res.status(201).json({ success: true, message: 'User created successfully', data: userSafe });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (getDBStatus()) {
      const updated = await User.findOneAndUpdate({ userId: id }, req.body, { new: true }).select('-password');
      if (updated) return res.json({ success: true, data: updated });
    }

    const idx = memUsers.findIndex((u) => u.userId === id);
    if (idx !== -1) {
      memUsers[idx] = { ...memUsers[idx], ...req.body };
      const { password, ...userSafe } = memUsers[idx];
      return res.json({ success: true, data: userSafe });
    }
    return res.status(404).json({ success: false, message: 'User not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (getDBStatus()) {
      await User.findOneAndDelete({ userId: id });
    }
    memUsers = memUsers.filter((u) => u.userId !== id);
    return res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };
