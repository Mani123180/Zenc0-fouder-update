const express = require('express');
const router = express.Router();
const { getTimetable, updateTimetableSlot } = require('../controllers/timetableController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getTimetable);
router.post('/slot', protect, updateTimetableSlot);

module.exports = router;
