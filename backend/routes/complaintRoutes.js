const express = require('express');
const router = express.Router();
const {
    createComplaint,
    getComplaints,
    getComplaintById,
    getMyComplaints,
    updateComplaintStatus,
    addMessage,
    getComplaintStats
} = require('../controllers/complaintController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createComplaint).get(protect, admin, getComplaints);
router.route('/stats').get(protect, getComplaintStats);
router.route('/my').get(protect, getMyComplaints);
router.route('/:id').get(protect, getComplaintById);
router.route('/:id/status').put(protect, admin, updateComplaintStatus);
router.route('/:id/message').post(protect, addMessage);

module.exports = router;
