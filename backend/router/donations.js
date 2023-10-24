const router = require('express').Router();
const asyncHandler = require('express-async-handler');

const Donation = require('../models/Donations');

// GET all donations
router.get('/', asyncHandler(async (req, res) => {
    try {
        const donations = await Donation.find().populate('donatedByAndAmount.user').populate('event');

        res.status(200).json(donations);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}));

// GET a donation
router.get('/:id', asyncHandler(async (req, res) => {
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

// POST start a donation
router.post('/', asyncHandler(async (req, res) => {
    const { targetAmount, event } = req.body;

    try {
        const donation = await Donation.create({
            targetAmount,
            event,
            currentAmount: 0
        });

        res.status(201).json(donation);

    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
));

// PUT donate to a donation
router.put('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;

    try {
        const donation = await Donation.findById(id);

        if (!donation) {
            res.status(404).json({ message: 'Donation not found' });
        }

        donation.currentAmount += amount;
        donation.donatedByAndAmount.push({ user: req.user._id, amount });

        await donation.save();

        res.status(200).json(donation);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
));

module.exports = router;