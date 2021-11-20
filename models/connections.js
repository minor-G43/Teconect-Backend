const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConnectionSchema = new Schema({
    user: {
        friends: {
            type: Array
        },
        outrequest: {
            type: Array
        },
        inrequest: {
            type: Array
        }
    }
});

const Connection = mongoose.model("friends", ConnectionSchema);
module.exports = Connection;