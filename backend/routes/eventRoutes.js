const express = require('express');
const router = express.Router();
const { getEvents, createEvent, rsvpEvent } = require('../controllers/eventController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getEvents).post(protect, admin, createEvent);
router.route('/:id/rsvp').post(protect, rsvpEvent);

module.exports = router;
