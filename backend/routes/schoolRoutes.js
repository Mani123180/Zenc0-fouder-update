const express = require('express');
const router = express.Router();
const { getSchools, getSchoolById, createSchool, updateSchool, deleteSchool } = require('../controllers/schoolController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getSchools);
router.get('/:id', protect, getSchoolById);
router.post('/', protect, authorize('superadmin'), createSchool);
router.put('/:id', protect, authorize('superadmin'), updateSchool);
router.delete('/:id', protect, authorize('superadmin'), deleteSchool);

module.exports = router;
