const mongoose = require('mongoose');
const addStudent = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mname: {
        type: String,
        required: true
    },
    fname: {
        type: String,
        required: true
    },
    reg: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    age: {
        type: Number,
        requried: true
    },
    gender: {
        type: String,
    },
    cls: {
        type: String,
            required: true
    },
    contact: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    }
})
const Schema = mongoose.model("addStudent", addStudent);

module.exports = Schema;
