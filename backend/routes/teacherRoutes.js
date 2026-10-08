const express = require('express');
const router = express.Router();
const { getTeachers, createTeacher, updateTeacher, deleteTeacher } = require('../controllers/teacherController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getTeachers);
router.post('/', protect, createTeacher);
router.put('/:id', protect, updateTeacher);
router.delete('/:id', protect, deleteTeacher);

module.exports = router;
