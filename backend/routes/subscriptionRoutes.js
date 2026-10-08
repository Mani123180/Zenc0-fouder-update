const express = require('express');
const router = express.Router();
const {
  getPlans,
  createPlan,
  getSubscriptions,
  createSubscription,
  getBills,
} = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/plans', protect, getPlans);
router.post('/plans', protect, createPlan);
router.get('/', protect, getSubscriptions);
router.post('/', protect, createSubscription);
router.get('/bills', protect, getBills);

module.exports = router;
