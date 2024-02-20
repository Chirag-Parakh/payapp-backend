const express = require('express');
const router = express.Router();
const {User} = require('../db')
const userMiddleware = require('../middleware');

router.get("/filter", async (req, res) => {
    try {
        const filter = req.query.filter;
        const regexFilter = new RegExp(filter, 'i');
        const foundUsers = await User.find({
            $or: [
                { firstName: { $regex: regexFilter } },
                { lastName: { $regex: regexFilter } },
                { username: { $regex: regexFilter } }]
        });
        if (!foundUsers) {
            res.json({ message: "users not found" });
        }
        res.json({ users: foundUsers })
    }
    catch (error){
        res.json({ message: "internal error occured"  , error : error })
    }
})

router.get('/'  ,userMiddleware, async (req , res) => {
    try{
        const users = await User.find({}).select('username firstName lastName')
        res.json({message : users})
    }catch(error){
        res.json({message : "could not fetch users" , error : error});
    }
})

module.exports = router;