const Message = require('../models/Message');
const { initialMessages } = require('../seed/seedData');
const { getDBStatus } = require('../config/db');

let memMessages = [...initialMessages];

const contactsList = [
  { id: 'USR003', name: 'Dr. Sunita Sharma', role: 'Principal', status: 'online', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80' },
  { id: 'USR004', name: 'Mrs. Priya Ramanathan', role: 'Mathematics Teacher', status: 'online', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' },
  { id: 'USR005', name: 'Mr. Anand Narayanan', role: 'Physics Teacher', status: 'away', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
  { id: 'USR001', name: 'Super Administrator', role: 'Central Trust', status: 'online', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
  { id: 'USR008', name: 'S. Krishnan', role: 'Parent (Class 12-A)', status: 'offline', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80' },
];

const getContacts = async (req, res) => {
  try {
    return res.json({ success: true, data: contactsList });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { contactId } = req.query;
    const currentUserId = req.user ? req.user.id : null;

    if (getDBStatus()) {
      let query = {};
      if (contactId && currentUserId) {
        query = {
          $or: [
            { senderId: currentUserId, receiverId: contactId },
            { senderId: contactId, receiverId: currentUserId },
          ],
        };
      }
      const msgs = await Message.find(query).sort({ createdAt: 1 });
      if (msgs.length > 0) return res.json({ success: true, data: msgs });
    }

    let filtered = [...memMessages];
    if (contactId && currentUserId) {
      filtered = filtered.filter(
        (m) =>
          (m.senderId === currentUserId && m.receiverId === contactId) ||
          (m.senderId === contactId && m.receiverId === currentUserId)
      );
    }

    return res.json({ success: true, data: filtered });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { receiverId, receiverName, receiverRole, text } = req.body;
    if (!receiverId || !text) {
      return res.status(400).json({ success: false, message: 'Receiver and message text are required' });
    }

    const currentUserId = req.user ? req.user.id : 'USR002';
    const currentUserName = req.user ? req.user.name : 'School Admin';
    const currentUserRole = req.user ? req.user.role : 'schooladmin';

    const msgId = 'MSG' + String(Date.now()).slice(-4);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      messageId: msgId,
      senderId: currentUserId,
      senderName: currentUserName,
      senderRole: currentUserRole,
      receiverId,
      receiverName: receiverName || 'User',
      receiverRole: receiverRole || 'staff',
      schoolId: req.user ? req.user.schoolId : 'SCH001',
      text: text.trim(),
      timestamp: timeStr,
      read: true,
    };

    if (getDBStatus()) {
      await Message.create(newMsg);
    }
    memMessages.push(newMsg);

    return res.status(201).json({ success: true, data: newMsg });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getContacts, getMessages, sendMessage };
