const mongoose = require('mongoose');

const billSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        amount: {
            type: Number,
            required: true,
        },
        type: {
            type: String,
            enum: ['maintenance', 'electricity', 'water', 'other'],
            default: 'maintenance'
        },
        dueDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['paid', 'pending', 'overdue'],
            default: 'pending',
        },
        invoiceNumber: {
            type: String
        },
        paymentDate: {
            type: Date
        },
        paymentMethod: {
            type: String
        },
        transactionId: {
            type: String
        }
    },
    {
        timestamps: true,
    }
);

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;
