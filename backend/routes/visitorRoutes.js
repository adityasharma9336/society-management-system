const express = require('express');
const router = express.Router();
const {
    addVisitor,
    getMyVisitors,
    getAllVisitors,
    getVisitorStats,
    exitVisitor
} = require('../controllers/visitorController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addVisitor).get(protect, admin, getAllVisitors);
router.route('/stats').get(protect, getVisitorStats);
router.route('/my').get(protect, getMyVisitors);
router.route('/:id/exit').put(protect, exitVisitor);

module.exports = router;
