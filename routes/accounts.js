const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET = require("../config");
const { Account } = require('../db');
const { default: mongoose } = require('mongoose');
router.get('/', (req, res) => {
    res.json({ message: "get some balance here" });
})

router.post('/transfer',   async (req, res) => {
    try {
        const session = await mongoose.startSession()
        session.startTransaction();
        const authtoken = req.headers.authorization;
        const token = authtoken.split(' ')[1]
        const jwtVerification = jwt.verify(token, JWT_SECRET)
        const fromUsername = jwtVerification.username;
        const { toUsername, amount } = req.body;


        const fromUser = await Account.findOne({ username: fromUsername }).session(session);
        if (!fromUser || fromUser.balance < amount) {
            await session.abortTransaction();
            return res.json({ message: "Insufficient balance" })
        }

        const toAccount = await Account.findOne({ username: toUsername }).session(session);
        if (!toAccount) {
            await session.abortTransaction();
            return res.json({ message: "Invalid reciver account" })
        }
        await Account.findOneAndUpdate({ username: fromUsername }, { $inc: { balance: - amount } }).session(session)
        await Account.findOneAndUpdate({ username: toUsername }, { $inc: { balance: + amount } }).session(session)
        await session.commitTransaction();
       return res.json({ message: "transaction successful" });

    }
    catch (error) {
        res.json({ message: "invalid user", error: error });
    }
})


router.get('/getbalance',  async (req, res) => {
    const authtoken = req.headers.authorization;
    const token = authtoken.split(' ')[1]
    const jwtVerification = jwt.verify(token, JWT_SECRET)
    const username = jwtVerification.username;
    const balanceinfo = await Account.findOne({ username }).select('balance');
    res.json({ message: balanceinfo });
})

module.exports = router;