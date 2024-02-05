const router = require('express').Router();
const asyncHandler = require('express-async-handler');

const { protect } = require("../middleware/authMiddleware");

const Donation = require('../models/Donations');
const EventTable = require('../models/EventTable');

// GET all donations
router.get('/', protect, asyncHandler(async (req, res) => {
    try {
        const donations = await Donation.find().populate('donatedByAndAmount.user').populate('event');

        res.status(200).json(donations);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}));

// GET a donation
router.get('/:id', protect, asyncHandler(async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id).populate('donatedByAndAmount.user').populate('event');

        if (!donation) {
            res.status(404).json({ message: 'Donation not found' });
        }

        res.status(200).json(donation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}));

// GET donation of an event
router.get('/event/:id', asyncHandler(async (req, res) => {
    try {
        const donation = await Donation.find({ event: req.params.id }).populate('donatedByAndAmount.user').populate('event');

        res.status(200).json(donation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}));

// GET donation of a group
router.get('/group/:id', asyncHandler(async (req, res) => {
    try {
        const event = await EventTable.find({ chatId: req.params.id });

        const donation = await Donation.find({ event: event }).populate('donatedByAndAmount.user').populate('event');

        res.status(200).json(donation);


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}));

// POST start a donation
router.post('/', protect, asyncHandler(async (req, res) => {
    const { targetAmount, event, name } = req.body;
    parseInt(targetAmount);

    if (!targetAmount || !event || !name) {
        res.status(400).json({ message: 'Please provide the target amount, event and name' });
    }

    const findDonation = await Donation.findOne({ event });

    try {
        const donation = await Donation.create({
            name,
            targetAmount,
            event,
            currentAmount: findDonation ? findDonation.currentAmount : 0,
        });

        if (findDonation) {
            await Donation.findByIdAndDelete(findDonation._id);
        }

        res.status(201).json(donation);

    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
));

// PUT donate to a donation
router.put('/:id', protect, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;
    parseInt(amount);

    if (!amount) {
        res.status(400).json({ message: 'Please provide the amount' });
    }

    try {
        const donation = await Donation.findById(id);

        if (!donation) {
            res.status(404).json({ message: 'Donation not found' });
        }

        donation.currentAmount += amount;

        const findUser = await Donation.where({ _id: id, donatedByAndAmount: { $elemMatch: { user: req.user._id } } });

        if (findUser.length > 0) {
            await Donation.updateOne({ _id: id, donatedByAndAmount: { $elemMatch: { user: req.user._id } } }, { $inc: { 'donatedByAndAmount.$.amount': amount } });
        }
        else {
            donation.donatedByAndAmount.push({ user: req.user._id, amount });
        }

        await donation.save();

        res.status(200).json(donation);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
));

// DELETE a donation
router.delete('/:id', protect, asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const donation = await Donation.findById(id);

        if (!donation) {
            res.status(404).json({ message: 'Donation not found' });
        }

        await Donation.findByIdAndDelete(id);

        res.status(200).json({ message: 'Donation deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
));

module.exports = router;