const express = require('express');
const router = express.Router();

router.get('/' , (req , res) => {
    res.json({message : "update page is up"});
})

module.exports = router;