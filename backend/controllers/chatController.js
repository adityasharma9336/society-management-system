const Channel = require('../models/Channel');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get all channels for a user (Public + Block + Private)
// @route   GET /api/chat/channels
// @access  Private
const getChannels = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        // 1. Get Public Channels (Ensure Defaults exist)
        let publicChannels = await Channel.find({ type: 'public' });

        if (publicChannels.length === 0) {
            const general = await Channel.create({
                name: 'General Society',
                type: 'public',
                description: 'General discussion for all residents'
            });
            const announcements = await Channel.create({
                name: 'Announcements',
                type: 'public',
                description: 'Official announcements'
            });
            publicChannels = [general, announcements];
        }

        // 2. Get Block Channel (Create if not exists)
        let blockChannel = null;
        if (user.block) {
            blockChannel = await Channel.findOne({ type: 'block', block: user.block });
            if (!blockChannel) {
                blockChannel = await Channel.create({
                    name: `Block ${user.block} - Residents`,
                    type: 'block',
                    block: user.block,
                    description: `Official channel for Block ${user.block} residents`
                });
            }
        }

        // 3. Get Private Channels where user is a member
        const privateChannels = await Channel.find({
            type: 'private',
            members: req.user._id
        }).populate('members', 'name profilePicture');

        let allChannels = [...publicChannels];
        if (blockChannel) allChannels.push(blockChannel);
        allChannels = [...allChannels, ...privateChannels];

        res.json(allChannels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get messages for a specific channel
// @route   GET /api/chat/channels/:channelId/messages
// @access  Private
const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({ channel: req.params.channelId })
            .populate('sender', 'name profilePicture block flatNo')
            .sort({ createdAt: 1 }); // Oldest first

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send a message to a channel
// @route   POST /api/chat/channels/:channelId/messages
// @access  Private
const sendMessage = async (req, res) => {
    try {
        const { content, attachments } = req.body;
        const { channelId } = req.params;

        const newMessage = new Message({
            sender: req.user._id,
            channel: channelId,
            content,
            attachments
        });

        const savedMessage = await newMessage.save();

        // Update last message in channel
        await Channel.findByIdAndUpdate(channelId, { lastMessage: savedMessage._id });

        const populatedMessage = await Message.findById(savedMessage._id)
            .populate('sender', 'name profilePicture block flatNo');

        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Create a private channel (DM)
// @route   POST /api/chat/channels/private
// @access  Private
const createPrivateChannel = async (req, res) => {
    try {
        const { recipientId } = req.body;

        // Check if exists
        const existingChannel = await Channel.findOne({
            type: 'private',
            members: { $all: [req.user._id, recipientId] }
        });

        if (existingChannel) {
            return res.json(existingChannel);
        }

        const newChannel = await Channel.create({
            name: 'Private Chat',
            type: 'private',
            members: [req.user._id, recipientId]
        });

        res.status(201).json(newChannel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getChannels,
    getMessages,
    sendMessage,
    createPrivateChannel
};
