const express = require('express');
const router = express.Router();
const {User} = require('../db')

router.get("/", async (req, res) => {
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

module.exports = router;