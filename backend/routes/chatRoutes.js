const express = require('express');
const router = express.Router();
const { getChannels, getMessages, sendMessage, createPrivateChannel } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.route('/channels').get(protect, getChannels);
router.route('/channels/private').post(protect, createPrivateChannel);
router.route('/channels/:channelId/messages')
    .get(protect, getMessages)
    .post(protect, sendMessage);

module.exports = router;
