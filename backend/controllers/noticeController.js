const Notice = require('../models/Notice');

// @desc    Get all notices
// @route   GET /api/notices
// @access  Private
const getNotices = async (req, res) => {
    try {
        const { category, type, search, page = 1, limit = 10 } = req.query;
        let query = {};

        if (category && category !== 'all') {
            query.category = category;
        }
        if (type && type !== 'all') {
            query.type = type;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
            ];
        }

        const count = await Notice.countDocuments(query);
        const notices = await Notice.find(query)
            .populate('postedBy', 'name')
            .sort({ createdAt: -1 }) // Show newest first
            .limit(limit * 1)
            .skip((page - 1) * limit);

        res.json({
            notices,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalNotices: count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new notice
// @route   POST /api/notices
// @access  Private/Admin
const createNotice = async (req, res) => {
    try {
        const { title, content, category, type, priority, eventDetails, attachments } = req.body;

        const notice = new Notice({
            title,
            content,
            category,
            type,
            priority,
            eventDetails,
            attachments,
            postedBy: req.user._id,
        });

        const createdNotice = await notice.save();
        res.status(201).json(createdNotice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a notice
// @route   DELETE /api/notices/:id
// @access  Private/Admin
const deleteNotice = async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);

        if (notice) {
            await notice.deleteOne();
            res.json({ message: 'Notice removed' });
        } else {
            res.status(404).json({ message: 'Notice not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getNotices,
    createNotice,
    deleteNotice
};
