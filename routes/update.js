// const express = require('express');
// const router = express.Router();
// const UserZodSchema = require('../zod');
// const {User} = require('../db');
// const bcrypt = require('bcrypt');
// const userMiddleware = require('../middleware');

// router.get('/', (req, res) => {
//     res.json({ message: "update page is up" });
// })
// router.put('/', userMiddleware,  async (req, res) => {
//     try {
//         const validate = UserZodSchema.safeParse(req.body);
//         if (validate.error) {
//             return res.status(400).json({ error: validate.error });
//         }
//         if (req.body.password) {
//             req.body.password = await bcrypt.hash(req.body.password, 10);
//         }
//         await User.updateOne({ username: req.body.username }, { $set: req.body })
//         const updatedUser = await User.findOne({ username: req.body.username });
//         res.json({ message: "User updated successfully", UserInfo: updatedUser });
//     }
//     catch (error) {
//         console.error("Error updating user:", error);
//         res.status(400).json({ "error": "Internal server error" });
//     }
//     })
// module.exports = router;
const express = require('express');
const router = express.Router();
const UserZodSchema = require('../zod');
const { User } = require('../db');
const argon2 = require('argon2');
const userMiddleware = require('../middleware');

router.get('/', (req, res) => {
    res.json({ message: "update page is up" });
});

router.put('/', userMiddleware, async (req, res) => {
    try {
        const validate = UserZodSchema.safeParse(req.body);
        if (validate.error) {
            return res.status(400).json({ error: validate.error });
        }
        if (req.body.password) {
            req.body.password = await argon2.hash(req.body.password);
        }
        await User.updateOne({ username: req.body.username }, { $set: req.body });
        const updatedUser = await User.findOne({ username: req.body.username });
        res.json({ message: "User updated successfully", UserInfo: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(400).json({ "error": "Internal server error" });
    }
});

module.exports = router;
