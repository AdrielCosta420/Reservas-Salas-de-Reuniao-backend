const mongoose = require('mongoose');

const MeetingRoom = mongoose.model('MeetingRoom',{
    name: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['livre', 'ocupada'], default: 'livre', required: false },
    startTime: { type: Date, required: false },
    endTime: { type: Date, required: false },
    participants: { type: String, required: false }
});

module.exports = MeetingRoom