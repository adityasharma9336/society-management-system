const Complaint = require('../models/Complaint');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res) => {
    try {
        const { subject, description, category, priority } = req.body;

        const complaint = new Complaint({
            user: req.user._id,
            subject,
            description,
            category,
            priority: priority || 'Medium',
            timeline: [{
                status: 'Open',
                date: Date.now(),
                note: 'Complaint Logged'
            }]
        });

        const createdComplaint = await complaint.save();
        res.status(201).json(createdComplaint);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all complaints (Admin)
// @route   GET /api/complaints
// @access  Private/Admin
const getComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({}).populate('user', 'id name block flatNo').sort('-createdAt');
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user complaints
// @route   GET /api/complaints/my
// @access  Private
const getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ user: req.user._id }).sort('-createdAt');
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private/Admin
const updateComplaintStatus = async (req, res) => {
    try {
        const { status, note, assignedTo } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (complaint) {
            complaint.status = status || complaint.status;
            if (assignedTo) complaint.assignedTo = assignedTo;

            complaint.timeline.push({
                status: status || complaint.status,
                date: Date.now(),
                note: note || `Status updated to ${status}`
            });

            const updatedComplaint = await complaint.save();
            res.json(updatedComplaint);
        } else {
            res.status(404).json({ message: 'Complaint not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add message to complaint chat
// @route   POST /api/complaints/:id/message
// @access  Private
const addMessage = async (req, res) => {
    try {
        const { content } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (complaint) {
            const sender = req.user.role === 'admin' ? 'admin' : 'user';

            complaint.messages.push({
                sender,
                content,
                date: Date.now()
            });

            const updatedComplaint = await complaint.save();
            res.json(updatedComplaint);
        } else {
            res.status(404).json({ message: 'Complaint not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get complaint stats
// @route   GET /api/complaints/stats
// @access  Private
const getComplaintStats = async (req, res) => {
    try {
        const total = await Complaint.countDocuments({});
        const open = await Complaint.countDocuments({ status: 'open' });
        const inProgress = await Complaint.countDocuments({ status: 'in_progress' });
        const resolved = await Complaint.countDocuments({ status: 'resolved' });

        res.json({ total, open, inProgress, resolved });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createComplaint,
    getComplaints,
    getMyComplaints,
    updateComplaintStatus,
    addMessage,
    getComplaintStats
};
