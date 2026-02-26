const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Complaint = require('./models/Complaint');

dotenv.config();

const checkComplaints = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const complaints = await Complaint.find({});
        console.log(`Found ${complaints.length} complaints`);
        complaints.forEach(c => {
            console.log(`Complaint ${c._id}: ${c.subject}`);
            console.log(`- Messages: ${c.messages.length}`);
            c.messages.forEach(m => {
                console.log(`  [${m.sender}] ${m.content}`);
            });
        });
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkComplaints();
