const express = require('express');
const router = express.Router();
const { getAdminDashboardStats } = require('../controllers/dashboardController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/dashboard-stats').get(protect, admin, getAdminDashboardStats);

module.exports = router;
