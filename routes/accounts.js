const express = require('express');
const router = express.Router();
const { Account } = require('../db');
router.get('/', (req, res) => {
    res.json({ message: "get some balance here" });
})

router.post('/transfer', async (req, res) => {
    try {
        const fromUsername = req.body.fromUsername;
        const toUsername = req.body.toUsername;
        const amount = req.body.amount;
        const fromUser = await Account.findOne({ username: fromUsername });
        if (fromUser.balance < amount) {
            res.json({ message: "Insufficient balance" })
        }
        try {
            await Account.findOneAndUpdate({ username: fromUsername }, { $inc: { balance: - amount } })
            await Account.findOneAndUpdate({ username: toUsername }, { $inc: { balance: + amount } })
            res.json({ message: "transaction successful" });
        } catch (error) {
            console.log(error)
            res.json({ message: "could not complete the transition" })
        }
    }
    catch (error) {
        res.json({ message: "internal error occured" });
    }
})

module.exports = router;