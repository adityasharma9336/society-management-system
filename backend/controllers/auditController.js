const AuditLog = require('../models/AuditLog');

// @desc    Get all audit logs
// @route   GET /api/audit
// @access  Private/Admin
const getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.find()
            .populate('user', 'name email role')
            .sort('-createdAt')
            .limit(100); // Limit to last 100 for performance
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAuditLogs };
