const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const promoteToAdmin = async (email) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email });
        if (!user) {
            console.error('User not found');
            process.exit(1);
        }
        user.role = 'admin';
        await user.save();
        console.log(`User ${email} promoted to admin successfully`);
        process.exit(0);
    } catch (error) {
        console.error('Error promoting user:', error);
        process.exit(1);
    }
};

const email = process.argv[2];
if (!email) {
    console.error('Please provide an email: node promote.js <email>');
    process.exit(1);
}

promoteToAdmin(email);
