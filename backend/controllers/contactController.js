const ContactInquiry = require('../models/ContactInquiry');
const { getDBStatus } = require('../config/db');

let memInquiries = [];

const submitInquiry = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and message' });
    }

    const inquiry = {
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Inquiry',
      message,
      status: 'New',
    };

    if (getDBStatus()) {
      await ContactInquiry.create(inquiry);
    }
    memInquiries.unshift({ ...inquiry, id: Date.now() });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received. Our admissions team will get back to you shortly.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getInquiries = async (req, res) => {
  try {
    if (getDBStatus()) {
      const inquiries = await ContactInquiry.find().sort({ createdAt: -1 });
      if (inquiries.length > 0) return res.json({ success: true, data: inquiries });
    }
    return res.json({ success: true, data: memInquiries });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { submitInquiry, getInquiries };
