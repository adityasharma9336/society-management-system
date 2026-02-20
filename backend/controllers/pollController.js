const Poll = require('../models/Poll');

// @desc    Get all polls (Active & Closed)
// @route   GET /api/polls
// @access  Private
const getPolls = async (req, res) => {
    try {
        const polls = await Poll.find({})
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name');

        // Add a flag if the current user has voted
        const pollsWithUserStatus = polls.map(poll => {
            const userVote = poll.votedBy.find(vote => vote.user.toString() === req.user._id.toString());
            return {
                ...poll.toObject(),
                hasVoted: !!userVote,
                userVoteOption: userVote ? userVote.optionIndex : null
            };
        });

        res.json(pollsWithUserStatus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new poll
// @route   POST /api/polls
// @access  Private/Admin
const createPoll = async (req, res) => {
    try {
        const { question, description, options, deadline, type } = req.body;

        const poll = new Poll({
            question,
            description,
            options: options.map(opt => ({ text: opt, votes: 0 })),
            createdBy: req.user._id,
            deadline,
            type
        });

        const createdPoll = await poll.save();
        res.status(201).json(createdPoll);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Vote on a poll
// @route   PUT /api/polls/:id/vote
// @access  Private
const votePoll = async (req, res) => {
    try {
        const { optionIndex } = req.body;
        const poll = await Poll.findById(req.params.id);

        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        // Check if closed
        if (!poll.isActive() && poll.status !== 'closed') {
            // Optional: Auto-close if deadline passed during vote attempt
            if (new Date() > poll.deadline) {
                poll.status = 'closed';
                await poll.save();
                return res.status(400).json({ message: 'Poll is closed' });
            }
        }
        if (poll.status === 'closed') {
            return res.status(400).json({ message: 'Poll is closed' });
        }

        // Check if already voted
        const alreadyVoted = poll.votedBy.find(vote => vote.user.toString() === req.user._id.toString());
        if (alreadyVoted) {
            return res.status(400).json({ message: 'You have already voted' });
        }

        // Validate option index
        if (optionIndex < 0 || optionIndex >= poll.options.length) {
            return res.status(400).json({ message: 'Invalid option' });
        }

        // Record vote
        poll.options[optionIndex].votes += 1;
        poll.votedBy.push({ user: req.user._id, optionIndex });

        const updatedPoll = await poll.save();

        // Return structured response similar to getPolls
        const userVote = updatedPoll.votedBy.find(vote => vote.user.toString() === req.user._id.toString());
        res.json({
            ...updatedPoll.toObject(),
            hasVoted: true,
            userVoteOption: userVote.optionIndex
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPolls,
    createPoll,
    votePoll
};
