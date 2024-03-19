// const express = require('express');
// const router = express.Router();
// const {User} = require('../db');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const JWT_SECRET = require("../config");

// router.get('/', (req, res) => {
//     res.send("signin page is up")
// });

// router.post('/' , async(req , res) => {
//     const {username , password} = req.body;

//    try{
//     const userExist = await User.findOne({username});
//     if(!userExist){
//         res.status(404).json({"message" : "user dosent exist"});
//     }

//     const checkPassword = await bcrypt.compare(password, userExist.password);
//     if(!checkPassword){
//         res.status(401).json({"message" : "Incorrect password"});
//     }

//     const token = jwt.sign({ username }, JWT_SECRET);
//     const userInfoWithoutPassword = userExist.toJSON();
//     delete userInfoWithoutPassword.password;
//     res.json({ message: "Signin successful", UserInfo: userInfoWithoutPassword, token: `Bearer ${token}` });
//    }
//    catch{(error) => {
//     console.error("Error in signin:", error);
//     res.status(500).json({ error: "Internal server error" });
//    }

//    }
// })

// module.exports = router;
const express = require('express');
const router = express.Router();
const { User } = require('../db');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require("../config");

router.get('/', (req, res) => {
    res.send("signin page is up")
});

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        const userExist = await User.findOne({ username });
        if (!userExist) {
            return res.status(404).json({ "message": "User doesn't exist" });
        }

        const checkPassword = await argon2.verify(userExist.password, password);
        if (!checkPassword) {
            return res.status(401).json({ "message": "Incorrect password" });
        }

        const token = jwt.sign({ username }, JWT_SECRET);
        const userInfoWithoutPassword = userExist.toJSON();
        delete userInfoWithoutPassword.password;
        return res.json({ message: "Signin successful", UserInfo: userInfoWithoutPassword, token: `Bearer ${token}` });
    } catch (error) {
        console.error("Error in signin:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
