const express = require('express');
const router = express.Router();
const User = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = require("../config");

router.get('/', (req, res) => {
    res.send("signup page is up");
});

router.post('/', async (req, res) => {
    const { username, password, email, firstName, lastName } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            if (existingUser.username === username) {
                return res.status(400).json({ "message": "Username already exists" });
            } else {
                return res.status(400).json({ "message": "Email already exists" });
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            firstName,
            lastName,
        });
        await newUser.save();
        const token = jwt.sign({ username }, JWT_SECRET);
        res.json({ "message": "User created successfully", "token": `Bearer ${token}` });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ "error": "Internal server error" });
    }
});

module.exports = router;
