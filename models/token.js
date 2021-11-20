const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    token: {
        type: String,
        required: [true, "Please enter Valid Token"]
    }
});

const Token = mongoose.model("Token", TokenSchema);

module.exports = Token;