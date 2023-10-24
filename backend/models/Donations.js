const mongoose = require('mongoose');

const DonationsSchema = new mongoose.Schema({
    targetAmount: {
        type: Number,
        required: true
    },
    currentAmount: {
        type: Number
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    donatedByAndAmount: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        amount: {
            type: Number,
        }
    }]
}, { timestamps: true });

const Donations = mongoose.model('Donations', DonationsSchema);

module.exports = Donations;