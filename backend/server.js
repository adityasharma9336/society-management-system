const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const socketIo = require('socket.io');
const http = require('http');

const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const visitorRoutes = require('./routes/visitorRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const eventRoutes = require('./routes/eventRoutes');
const billRoutes = require('./routes/billRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
app.set('socketio', io);

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/users', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/polls', require('./routes/pollRoutes'));
app.use('/api/amenities', require('./routes/amenityRoutes'));
app.use('/api/audit', require('./routes/auditRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Socket.IO Connection
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Channel based chat
    socket.on('join_channel', (channelId) => {
        socket.join(channelId);
        console.log(`User ${socket.id} joined channel: ${channelId}`);
    });

    socket.on('new_message', (data) => {
        const { channelId, message } = data;
        // Broadcast to others in the channel
        socket.to(channelId).emit('receive_message', message);
    });

    // Online/Offline Status (Simple implementation)
    socket.on('user_online', (userId) => {
        socket.userId = userId;
        socket.broadcast.emit('user_status_change', { userId, status: 'online' });
    });

    socket.on('disconnect', () => {
        if (socket.userId) {
            socket.broadcast.emit('user_status_change', { userId: socket.userId, status: 'offline' });
        }
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;

const initCronJobs = require('./utils/cronJobs');
initCronJobs();

server.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
