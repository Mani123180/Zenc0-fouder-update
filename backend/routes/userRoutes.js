const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getUsers);
router.post('/', protect, authorize('superadmin', 'schooladmin'), createUser);
router.put('/:id', protect, authorize('superadmin', 'schooladmin'), updateUser);
router.delete('/:id', protect, authorize('superadmin', 'schooladmin'), deleteUser);

module.exports = router;
