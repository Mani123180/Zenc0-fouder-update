const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');
const Bill = require('../models/Bill');
const { initialPlans, initialSubscriptions, initialBills } = require('../seed/seedData');
const { getDBStatus } = require('../config/db');

let memPlans = [...initialPlans];
let memSubscriptions = [...initialSubscriptions];
let memBills = [...initialBills];

// Plans
const getPlans = async (req, res) => {
  try {
    if (getDBStatus()) {
      const plans = await Plan.find();
      if (plans.length > 0) return res.json({ success: true, data: plans });
    }
    return res.json({ success: true, data: memPlans });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createPlan = async (req, res) => {
  try {
    const { name, code, price, billingCycle, maxStudents, maxTeachers, features } = req.body;
    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Plan name and price are required' });
    }

    const planId = 'PLAN' + String(Date.now()).slice(-4);
    const newPlan = {
      planId,
      name,
      code: code || name.toUpperCase().replace(/\s+/g, '-').slice(0, 8),
      price: Number(price),
      billingCycle: billingCycle || 'Annual',
      maxStudents: Number(maxStudents) || 1000,
      maxTeachers: Number(maxTeachers) || 80,
      features: Array.isArray(features) ? features : (typeof features === 'string' ? features.split(',').map((f) => f.trim()) : ['Core Module Access']),
      status: 'Active',
    };

    if (getDBStatus()) {
      await Plan.create(newPlan);
    }
    memPlans.push(newPlan);

    return res.status(201).json({ success: true, message: 'Plan created successfully', data: newPlan });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Subscriptions
const getSubscriptions = async (req, res) => {
  try {
    if (getDBStatus()) {
      const subs = await Subscription.find();
      if (subs.length > 0) return res.json({ success: true, data: subs });
    }
    return res.json({ success: true, data: memSubscriptions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createSubscription = async (req, res) => {
  try {
    const { schoolId, schoolName, planName, amount, billingCycle, autoRenew } = req.body;
    if (!schoolName || !planName) {
      return res.status(400).json({ success: false, message: 'School name and Plan name are required' });
    }

    const subscriptionId = 'SUB' + String(Date.now()).slice(-4);
    const startDate = new Date().toISOString().split('T')[0];
    const expDate = new Date();
    expDate.setFullYear(expDate.getFullYear() + 1);
    const expiryDate = expDate.toISOString().split('T')[0];

    const newSub = {
      subscriptionId,
      schoolId: schoolId || 'SCH001',
      schoolName,
      planName,
      status: 'Active',
      startDate,
      expiryDate,
      amount: Number(amount) || 48000,
      billingCycle: billingCycle || 'Annual',
      autoRenew: autoRenew !== false,
    };

    if (getDBStatus()) {
      await Subscription.create(newSub);
    }
    memSubscriptions.unshift(newSub);

    // Also auto-generate an invoice in Bills!
    const invoiceNo = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newBill = {
      invoiceNo,
      schoolName,
      planName,
      amount: newSub.amount,
      date: startDate,
      status: 'Paid',
      paymentMethod: 'Net Banking',
    };
    if (getDBStatus()) {
      await Bill.create(newBill);
    }
    memBills.unshift(newBill);

    return res.status(201).json({ success: true, message: 'Subscription assigned successfully', data: newSub });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Bills
const getBills = async (req, res) => {
  try {
    if (getDBStatus()) {
      const bills = await Bill.find();
      if (bills.length > 0) return res.json({ success: true, data: bills });
    }
    return res.json({ success: true, data: memBills });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPlans,
  createPlan,
  getSubscriptions,
  createSubscription,
  getBills,
};
