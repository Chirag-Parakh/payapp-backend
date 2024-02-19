const express = require('express');
const router = express.Router();
const UserZodSchema = require('../zod');
const {User} = require('../db');
const bcrypt = require('bcrypt');
router.get('/', (req, res) => {
    res.json({ message: "update page is up" });
})
router.put('/', async (req, res) => {
    try {
        const validate = UserZodSchema.safeParse(req.body);
        if (validate.error) {
            res.status(400).json({ error: validate.error });
        }
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        await User.updateOne({ username: req.body.username }, { $set: req.body })
        const updatedUser = await User.findOne({ username: req.body.username });
        res.json({ message: "User updated successfully", user: updatedUser });
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ "error": "Internal server error" });
    }
    })
module.exports = router;