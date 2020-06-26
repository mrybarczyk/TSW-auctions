const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Message schema
const MessageSchema = new Schema({
    from: {
        type: String
    },
    to: {
        type: String
    },
    msg: {
        type: String
    },
    date: {
        type: Date
    }
});

module.exports = Message = mongoose.model('msgs', MessageSchema);