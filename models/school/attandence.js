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
        type: String,
        default: Date.now
    },
    attendance: {
        type: String
    }
})




const Schema = mongoose.model("addAttandence", addAttendance);

module.exports = Schema;