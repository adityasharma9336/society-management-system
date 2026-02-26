const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Private
const getEvents = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const events = await Event.find({ date: { $gte: today } }).sort('date');
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
    try {
        const { title, description, date, location, category, image, startTime, endTime, isFeatured } = req.body;

        const event = new Event({
            title,
            description,
            date,
            location,
            category,
            image,
            startTime,
            endTime,
            isFeatured
        });

        const createdEvent = await event.save();
        res.status(201).json(createdEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    RSVP to an event
// @route   POST /api/events/:id/rsvp
// @access  Private
const rsvpEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user already RSVP'd
        if (event.rsvpList.includes(req.user._id)) {
            // Un-RSVP (remove from list)
            event.rsvpList = event.rsvpList.filter(
                (userId) => userId.toString() !== req.user._id.toString()
            );
        } else {
            // RSVP (add to list)
            event.rsvpList.push(req.user._id);
        }

        await event.save();
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getEvents, createEvent, rsvpEvent };
