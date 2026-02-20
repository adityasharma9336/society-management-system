const User = require('../models/User');
const Complaint = require('../models/Complaint');
const Bill = require('../models/Bill');
const Visitor = require('../models/Visitor');

// @desc    Get admin dashboard overall statistics
// @route   GET /api/dashboard/admin
// @access  Private/Admin
const getAdminDashboardStats = async (req, res) => {
    try {
        // Total Residents
        const totalResidents = await User.countDocuments({ role: 'resident' });

        // Active Complaints
        const activeComplaints = await Complaint.countDocuments({ status: { $in: ['open', 'in_progress'] } });

        // Pending Dues
        const bills = await Bill.find({ status: { $in: ['pending', 'overdue'] } });
        const pendingDues = bills.reduce((acc, curr) => acc + curr.amount, 0);

        // Today's Visitors
        const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
        const todayEnd = new Date(new Date().setHours(23, 59, 59, 999));

        const todaysVisitors = await Visitor.countDocuments({
            createdAt: { $gte: todayStart, $lt: todayEnd }
        });

        res.json({
            totalResidents,
            activeComplaints,
            pendingDues,
            todaysVisitors
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAdminDashboardStats };
