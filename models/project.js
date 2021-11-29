const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    ownerid: {
        type: mongoose.Schema.Types.ObjectId
    },
    title: {
        type: String,
        required: true
    },
    tags:{
        type : Array,
        required : true
    },
    url: {
        type: String
    },
    description: {
        type: String,
        required: true
    }
})

const Profile = mongoose.model("Project", ProfileSchema,"Project");

module.exports = Profile;