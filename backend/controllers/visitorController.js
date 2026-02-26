const Visitor = require('../models/Visitor');

// @desc    Add a visitor (Gatekeeper/Admin or Resident for expected visitors)
// @route   POST /api/visitors
// @access  Private
const addVisitor = async (req, res) => {
    try {
        const { name, phone, purpose, residentId, status, type, expectedDate } = req.body;

        // Generate unique pass code
        const passCode = 'SC-' + Math.floor(1000 + Math.random() * 9000);

        const visitor = new Visitor({
            resident: residentId || req.user._id,
            name,
            phone,
            purpose,
            status: status || (req.user.role === 'admin' ? 'approved' : 'pending'),
            type: type || 'Personal Guest',
            expectedDate: expectedDate || Date.now(),
            passCode
        });

        const createdVisitor = await visitor.save();
        const populatedVisitor = await Visitor.findById(createdVisitor._id).populate('resident', 'name block flatNo');
        res.status(201).json(populatedVisitor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get visitor statistics
// @route   GET /api/visitors/stats
// @access  Private
const getVisitorStats = async (req, res) => {
    try {
        const active = await Visitor.countDocuments({ status: 'checked_in' });
        const expected = await Visitor.countDocuments({
            status: 'expected',
            expectedDate: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                $lt: new Date(new Date().setHours(23, 59, 59, 999))
            }
        });
        const total = await Visitor.countDocuments({
            createdAt: {
                $gte: new Date(new Date().setDate(new Date().getDate() - 30))
            }
        });
        const deliveries = await Visitor.countDocuments({
            type: 'Delivery Partner',
            createdAt: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                $lt: new Date(new Date().setHours(23, 59, 59, 999))
            }
        });

        res.json({ active, expected, total, deliveries });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark visitor exit
// @route   PUT /api/visitors/:id/exit
// @access  Private
const exitVisitor = async (req, res) => {
    try {
        const visitor = await Visitor.findById(req.params.id);

        if (visitor) {
            visitor.status = 'checked_out';
            visitor.exitTime = Date.now();
            const updatedVisitor = await visitor.save();
            res.json(updatedVisitor);
        } else {
            res.status(404).json({ message: 'Visitor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get visitors for logged in user
// @route   GET /api/visitors/my
// @access  Private
const getMyVisitors = async (req, res) => {
    try {
        const visitors = await Visitor.find({ resident: req.user._id }).sort('-createdAt');
        res.json(visitors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all visitors (Admin)
// @route   GET /api/visitors
// @access  Private/Admin
const getAllVisitors = async (req, res) => {
    try {
        const visitors = await Visitor.find({}).populate('resident', 'name block flatNo').sort('-createdAt');
        res.json(visitors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update visitor status (Admin)
// @route   PUT /api/visitors/:id/status
// @access  Private/Admin
const updateVisitorStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const visitor = await Visitor.findById(req.params.id);

        if (visitor) {
            visitor.status = status;
            await visitor.save();
            const updatedVisitor = await Visitor.findById(visitor._id).populate('resident', 'name block flatNo');
            res.json(updatedVisitor);
        } else {
            res.status(404).json({ message: 'Visitor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addVisitor, getVisitorStats, exitVisitor, getMyVisitors, getAllVisitors, updateVisitorStatus };
