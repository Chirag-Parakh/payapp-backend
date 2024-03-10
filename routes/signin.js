const express = require('express');
const router = express.Router();
const {User} = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = require("../config");

router.get('/', (req, res) => {
    res.send("signin page is up")
});

router.post('/' , async(req , res) => {
    const {username , password} = req.body;

   try{
    const userExist = await User.findOne({username});
    if(!userExist){
        res.status(404).json({"message" : "user dosent exist"});
    }

    const checkPassword = await bcrypt.compare(password, userExist.password);
    if(!checkPassword){
        res.status(401).json({"message" : "Incorrect password"});
    }

    const token = jwt.sign({username }, JWT_SECRET);
    const userInfoToSend = { ...userExist };
     delete userInfoToSend.password;
    res.json({ message: "Signin successful", UserInfo :userInfoToSend , token: `Bearer ${token}` });
   }
   catch{(error) => {
    console.error("Error in signin:", error);
    res.status(500).json({ error: "Internal server error" });
   }

   }
})

module.exports = router;