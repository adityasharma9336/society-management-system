const mongoose = require('mongoose');

const societySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        contactNumber: {
            type: String,
        },
        regNumber: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Society = mongoose.model('Society', societySchema);

module.exports = Society;
