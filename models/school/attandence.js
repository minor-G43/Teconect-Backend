const mongoose = require('mongoose');

// Add Attendance
const addAttendance = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    reg: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    Attendance: {
        type: String,
        enum: ['Present', 'Absent']
    }
})




const Schema = mongoose.model("addAttandence", addAttendance);

module.exports = Schema;