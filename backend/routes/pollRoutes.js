const express = require('express');
const router = express.Router();
const { getPolls, createPoll, votePoll } = require('../controllers/pollController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getPolls)
    .post(protect, admin, createPoll);

router.route('/:id/vote').put(protect, votePoll);

module.exports = router;
