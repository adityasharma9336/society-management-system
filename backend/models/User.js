const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
        },
        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ['admin', 'resident', 'member', 'guard'],
            default: 'member',
        },
        block: {
            type: String, // e.g., 'A', 'B'
        },
        flatNo: {
            type: String, // e.g., '101', '304'
        },
        profilePicture: {
            type: String,
            default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
        },
        familyMembers: [
            {
                name: String,
                relation: String,
                age: Number,
            },
        ],
        vehicles: [
            {
                type: { type: String, enum: ['2 Wheeler', '4 Wheeler'] },
                number: String,
                make: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
