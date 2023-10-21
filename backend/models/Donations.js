const mongoose = require('mongoose');

const DonationsSchema = new mongoose.Schema({
    targetAmount: {
        type: Number,
        required: true
    },
    currentAmount: {
        type: Number,
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    },
    donatedByAndAmount: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        amount: {
            type: Number,
            required: true
        }
    }]
}, { timestamps: true });

const Donations = mongoose.model('Donations', DonationsSchema);

module.exports = Donations;