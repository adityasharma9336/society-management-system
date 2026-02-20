const express = require('express');
const router = express.Router();
const { getMyBills, getBills, createBill, payBill, getBillingStats } = require('../controllers/billController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, admin, getBills).post(protect, admin, createBill);
router.route('/stats').get(protect, admin, getBillingStats);
router.route('/my').get(protect, getMyBills);
router.route('/:id/pay').post(protect, payBill);

module.exports = router;
