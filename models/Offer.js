const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Offer schema
const OfferSchema = new Schema({
    owner: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startdate:{
        type: Date,
        default: Date.now
    },
    enddate:{
        type: Date
    },
    isAuction:{
        type: Boolean,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    userList: [
        {
            type: String
        }
    ],
    winner:{
        type: String
    },
    status: {
        type: String,
        enum: ["inactive", "active", "sold", "expired"]
    }
});

module.exports = Offer = mongoose.model('offers', OfferSchema);