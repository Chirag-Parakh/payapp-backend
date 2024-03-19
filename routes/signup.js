// const express = require('express');
// const router = express.Router();
// const { User, Account } = require('../db');
// const UserZodSchema = require('../zod');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const JWT_SECRET = require("../config");

// router.get('/', (req, res) => {
//     res.send("signup page is up");
// });

// router.post('/', async (req, res) => {
//     const { username, password, email, firstName, lastName } = req.body;
//     try {
//         const existingUser = await User.findOne({ $or: [{ username }, { email }] });
//         if (existingUser) {
//             if (existingUser.username === username) {
//                 return res.status(400).json({ "message": "Username already exists" });
//             } else {
//                 return res.status(400).json({ "message": "Email already exists" });
//             }
//         }
//         const newfirstName = firstName[0].toUpperCase() + firstName.slice(1)
//         const newUser = new User({
//             username ,
//             password,
//             email,
//             firstName : newfirstName,
//             lastName,
//         });
//         const validate = UserZodSchema.safeParse(newUser);
//         if (validate.error) {
//             return res.status(400).json({ error: validate.error });
//         }
//         newUser.password = await bcrypt.hash(newUser.password, 10);
//         await newUser.save();

//         const accountInfo = new Account({
//             username: username,
//             balance: 1 + Math.floor(Math.random() * 10000)
//         });
//         await accountInfo.save();

//         const token = jwt.sign({ username }, JWT_SECRET);
//         const infotoSend = {username,  email, firstName, lastName};
//         return res.json({ "message": "User created successfully", "token": `Bearer ${token}` , UserInfo :infotoSend });
//     } catch (error) {
//         console.error("Error creating user:", error);
//         return res.status(500).json({ "error": "Internal server error" });
//     }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const { User, Account } = require('../db');
const UserZodSchema = require('../zod');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
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
        const newfirstName = firstName[0].toUpperCase() + firstName.slice(1)
        const newUser = new User({
            username,
            password,
            email,
            firstName: newfirstName,
            lastName,
        });
        const validate = UserZodSchema.safeParse(newUser);
        if (validate.error) {
            return res.status(400).json({ error: validate.error });
        }
        newUser.password = await argon2.hash(newUser.password);
        await newUser.save();

        const accountInfo = new Account({
            username: username,
            balance: 1 + Math.floor(Math.random() * 10000)
        });
        await accountInfo.save();

        const token = jwt.sign({ username }, JWT_SECRET);
        const infotoSend = { username, email, firstName, lastName };
        return res.json({ "message": "User created successfully", "token": `Bearer ${token}`, UserInfo: infotoSend });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ "error": "Internal server error" });
    }
});

module.exports = router;


