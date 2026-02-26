const Bill = require('../models/Bill');
const Notice = require('../models/Notice');
const User = require('../models/User');

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
        const bill = await Bill.findById(req.params.id).populate('user', 'name flatNo');

        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        // Ensure user owns the bill
        if (bill.user._id.toString() !== req.user._id.toString()) {
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

        // Create a notification for Admin
        const adminNotification = new Notice({
            title: 'New Payment Received',
            content: `Resident ${bill.user.name} (Flat ${bill.user.flatNo}) has paid ${bill.type} bill of $${bill.amount}.`,
            postedBy: req.user._id,
            category: 'maintenance',
            type: 'alert'
        });
        await adminNotification.save();

        // Emit socket event if io is available
        const io = req.app.get('socketio');
        if (io) {
            io.emit('new_notification', adminNotification);
        }

        res.json(updatedBill);
    } catch (error) {
        console.error("PayBill Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get billing statistics (Admin)
// @route   GET /api/bills/stats
// @access  Private/Admin
const getBillingStats = async (req, res) => {
    try {
        const totalBills = await Bill.countDocuments();
        const paidBillsCount = await Bill.countDocuments({ status: 'paid' });
        const pendingBillsCount = await Bill.countDocuments({ status: 'pending' });

        res.json({
            totalBills,
            paidBillsCount,
            pendingBillsCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Bulk create bills for all residents
// @route   POST /api/bills/bulk
// @access  Private/Admin
const generateBulkBills = async (req, res) => {
    try {
        const User = require('../models/User');
        const residents = await User.find({ role: 'member' });

        const { amount, type, dueDate } = req.body;

        const bills = residents.map(resident => ({
            user: resident._id,
            amount,
            type,
            dueDate,
            invoiceNumber: `INV-${Date.now()}-${resident.flatNo}`
        }));

        const createdBills = await Bill.insertMany(bills);
        res.status(201).json({ message: `${createdBills.length} bills generated successfully`, count: createdBills.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMyBills, getBills, createBill, payBill, getBillingStats, generateBulkBills };
