const User = require('../models/User');
const Bill = require('../models/Bill');
const Complaint = require('../models/Complaint');
const Visitor = require('../models/Visitor');
const Notice = require('../models/Notice');

// @desc    Get admin dashboard statistics
// @route   GET /api/dashboard/admin
// @access  Private/Admin
const getAdminDashboardStats = async (req, res) => {
    try {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        // Basic Counts & Latest Data
        const [
            usersCount,
            billsCount,
            pendingBillsCount,
            complaintsCount,
            pendingComplaintsCount,
            visitorsCount,
            noticesCount,
            resolvedThisMonth,
            newUsersThisMonth,
            recentPendingComplaints,
            pendingVisitorsCount
        ] = await Promise.all([
            User.countDocuments(),
            Bill.countDocuments(),
            Bill.countDocuments({ status: 'pending' }),
            Complaint.countDocuments(),
            Complaint.countDocuments({ status: 'pending' }),
            Visitor.countDocuments(),
            Notice.countDocuments(),
            Complaint.countDocuments({ status: 'resolved', updatedAt: { $gte: startOfMonth } }),
            User.countDocuments({ createdAt: { $gte: startOfMonth } }),
            Complaint.find({ status: { $in: ['open', 'in_progress'] } })
                .populate('user', 'name flatNo')
                .sort('-createdAt')
                .limit(5),
            Visitor.countDocuments({ status: 'pending' })
        ]);

        // Monthly Revenue Calculation (Last 6 Months)
        const revenuePromises = [];
        const monthLabels = [];

        for (let i = 5; i >= 0; i--) {
            const start = new Date();
            start.setMonth(start.getMonth() - i);
            start.setDate(1);
            start.setHours(0, 0, 0, 0);

            const end = new Date(start);
            end.setMonth(end.getMonth() + 1);

            monthLabels.push(start.toLocaleString('default', { month: 'short' }));

            // Push paid and pending aggregation promises
            revenuePromises.push(
                Bill.aggregate([
                    { $match: { status: 'paid', updatedAt: { $gte: start, $lt: end } } },
                    { $group: { _id: null, total: { $sum: '$amount' } } }
                ]),
                Bill.aggregate([
                    { $match: { status: 'pending', createdAt: { $gte: start, $lt: end } } },
                    { $group: { _id: null, total: { $sum: '$amount' } } }
                ])
            );
        }

        const revenueResults = await Promise.all(revenuePromises);
        const revenueData = [];

        for (let i = 0; i < 6; i++) {
            revenueData.push({
                month: monthLabels[i],
                paid: revenueResults[i * 2][0]?.total || 0,
                pending: revenueResults[i * 2 + 1][0]?.total || 0
            });
        }

        res.json({
            users: usersCount,
            bills: billsCount,
            pendingBills: pendingBillsCount,
            complaints: complaintsCount,
            pendingComplaints: pendingComplaintsCount,
            visitors: visitorsCount,
            notices: noticesCount,
            resolvedThisMonth,
            newUsersThisMonth,
            revenueData,
            recentPendingComplaints,
            pendingVisitorsCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAdminDashboardStats };
