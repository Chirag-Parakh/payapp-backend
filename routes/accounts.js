const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET = require("../config");
const mongoose = require('mongoose');
const { Account, Transaction } = require('../db');
router.get('/', (req, res) => {
    res.json({ message: "get some balance here" });
})

router.post('/transfer', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const authtoken = req.headers.authorization;
        const token = authtoken.split(' ')[1];
        const jwtVerification = jwt.verify(token, JWT_SECRET);
        const fromUsername = jwtVerification.username;
        const { toUsername, amount } = req.body;

        const fromUser = await Account.findOne({ username: fromUsername }).session(session);
        if (!fromUser || fromUser.balance < amount) {
            throw new Error("Insufficient balance");
        }

        const toAccount = await Account.findOne({ username: toUsername }).session(session);
        if (!toAccount) {
            throw new Error("Invalid receiver account");
        }

        await Account.findOneAndUpdate({ username: fromUsername }, { $inc: { balance: -amount } }).session(session);
        await Account.findOneAndUpdate({ username: toUsername }, { $inc: { balance: amount } }).session(session);

        const newTransition = new Transaction({
            fromusername: fromUsername,
            tousername: toUsername,
            amount: amount,
            date: new Date()
        });
        
        await newTransition.save({ session: session });
        
        await session.commitTransaction();
        session.endSession();

        return res.json({ message: "Transaction successful" });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        
        return res.status(400).json({ message: "Transaction failed", error: error.message });
    }
});
// router.post('/transfer', async (req, res) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();
//     try {
//         const authtoken = req.headers.authorization;
//         const token = authtoken.split(' ')[1];
//         const jwtVerification = jwt.verify(token, JWT_SECRET);
//         const fromUsername = jwtVerification.username;
//         const { toUsername, amount } = req.body;
//         const fromUser = await Account.findOne({ username: fromUsername }).session(session);
//         if (!fromUser || fromUser.balance < amount) {
//             await session.abortTransaction();
//             return res.status(400).json({ message: "Insufficient balance" });
//         }
//         const toAccount = await Account.findOne({ username: toUsername }).session(session);
//         if (!toAccount) {
//             await session.abortTransaction();
//             return res.status(400).json({ message: "Invalid receiver account" });
//         }
//         await Account.findOneAndUpdate({ username: fromUsername }, { $inc: { balance: - amount } } , { session: session })
//         await Account.findOneAndUpdate({ username: toUsername }, { $inc: { balance: + amount } } , { session: session })
//         const newTransition = new Transaction({
//             fromusername: fromUsername,
//             tousername: toUsername,
//             amount: amount,
//             date: new Date() 
//         });
//         (await newTransition.save().session(session));
//         await session.commitTransaction();
//         session.endSession(); 
//         return res.json({ message: "Transaction successful" });
//     } catch (error) {
//         return res.json({ message: "Invalid user", error: error.message });
//     }
// });

router.get('/getbalance', async (req, res) => {
    const authtoken = req.headers.authorization;
    const token = authtoken.split(' ')[1]
    const jwtVerification = jwt.verify(token, JWT_SECRET)
    const username = jwtVerification.username;
    const balanceinfo = await Account.findOne({ username }).select('balance');
    res.json({ message: balanceinfo });
})

router.get('/transitions', async (req, res) => {
    try {
        const authtoken = req.headers.authorization;
        const token = authtoken.split(' ')[1];
        const jwtVerification = jwt.verify(token, JWT_SECRET);
        const username = jwtVerification.username;
        const transitions = await Transaction.find({ $or: [{ fromusername: username }, { tousername: username }] });
        if (!transitions) {
            return res.json({ message: "no transitions made" })
        }
        return res.json({ message: transitions });
    }
    catch {
        res.json({ message: "error occured" });
    }
})

module.exports = router;