// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Trainer = require('../models/trainerModel');

exports.register = async (req, res) => {
    const { email, password, username, googleDriveFolderId, trainerId } = req.body;

    try {
        let user = await Trainer.findOne({ email });
        if (user) return res.status(400).json({ msg: 'Trainer already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new Trainer({ email, password: hashedPassword , googleDriveFolderId, username, trainerId});
        await user.save();
        res.status(201).json({ msg: 'Trainer registered successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await Trainer.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};