const user = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const express = require('express');
const app = express();

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await user.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        res.status(200).json({ message: 'Login successful', user: existingUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body; 
    try {
        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }   
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new user({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = app;