const Bill = require('../models/Bill');

// @desc    Get logged in user bills
// @route   GET /api/bills/my
// @access  Private
const getMyBills = async (req, res) => {
    try {
        const bills = await Bill.find({ user: req.user._id }).sort('-dueDate');
        res.json(bills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bills (Admin)
// @route   GET /api/bills
// @access  Private/Admin
const getBills = async (req, res) => {
    try {
        const bills = await Bill.find({}).populate('user', 'name block flatNo');
        res.json(bills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a bill (Maintenance/Utility)
// @route   POST /api/bills
// @access  Private/Admin
const createBill = async (req, res) => {
    try {
        const { userId, amount, type, dueDate, invoiceNumber } = req.body;

        const bill = new Bill({
            user: userId,
            amount,
            type,
            dueDate,
            invoiceNumber
        });

        const createdBill = await bill.save();
        res.status(201).json(createdBill);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Pay a bill
// @route   POST /api/bills/:id/pay
// @access  Private
const payBill = async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id);

        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        // Ensure user owns the bill
        if (bill.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (bill.status === 'paid') {
            return res.status(400).json({ message: 'Bill is already paid' });
        }

        bill.status = 'paid';
        bill.paymentDate = Date.now();
        bill.paymentMethod = req.body.paymentMethod || 'Online';
        bill.transactionId = req.body.transactionId || `TXN${Date.now()}`;

        const updatedBill = await bill.save();
        res.json(updatedBill);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get billing statistics
// @route   GET /api/bills/stats
// @access  Private/Admin
const getBillingStats = async (req, res) => {
    try {
        const bills = await Bill.find({});

        const totalCollected = bills
            .filter(b => b.status === 'paid')
            .reduce((acc, curr) => acc + curr.amount, 0);

        const outstandingDues = bills
            .filter(b => b.status === 'pending' || b.status === 'overdue')
            .reduce((acc, curr) => acc + curr.amount, 0);

        // For "Pending Approvals" we will just return a mock value for now, or count bills that need manual verification if applicable.
        const pendingApprovals = 0;

        res.json({ totalCollected, outstandingDues, pendingApprovals });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMyBills, getBills, createBill, payBill, getBillingStats };
