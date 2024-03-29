const express = require('express');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModels');
const router = express.Router();

require('dotenv').config();

const secretKey = process.env.SECRET_KEY // || 'something-key';

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (user && await user.comparePassword(password)) {
            // store userId
            const userId = user._id;
            // generate token
            const token = jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
            res.json({ token, userId });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;