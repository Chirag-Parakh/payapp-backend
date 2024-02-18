const express = require('express');
const router = express.Router();
const User = require('../db')

router.get("/" , async (req , res) =>{
    try{
        const filter = req.query.filter;
        const foundUsers = await User.find({ $or: [{firstName : filter} , {lastName :filter} , {username : filter}]});
        if(!foundUsers){
            res.json({message : "users not found"});
        }
        res.json({users :foundUsers })
    }
    catch{
        res.json({message :"internal error occured"})
    }
})

module.exports = router;