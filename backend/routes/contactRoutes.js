const express = require('express');
const router = express.Router();
const { submitInquiry, getInquiries } = require('../controllers/contactController');

router.post('/', submitInquiry);
router.get('/', getInquiries);

module.exports = router;
