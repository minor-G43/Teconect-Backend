const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Please enter Valid Token"]
    }
});

const Token = mongoose.model("token", UserSchema);

module.exports = Token;