const mongoose = require("mongoose");
const { date } = require("zod");

mongoose.connect('mongodb+srv://cparakh53:VsR0suwDAa7XjbEs@chiraglearn.7ynaqrk.mongodb.net/payapp')
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Error connecting to MongoDB:", err));

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
    },
    email: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: [true, "First name is required"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"]
    }
});
const accountSchema = new mongoose.Schema({
    username: {
        type : String,
        ref : 'User',
        required: true
    },
    balance : {
        type : Number,
        required: true
    }
})

const transactionSchema = new mongoose.Schema({
    tousername : {
        type : String,
        required: true
    },
    fromusername : {
        type : String,
        required: true
    },
    amount : {
        type : Number,
        required: true
    },
    date : {
        type : Date,
        default : Date.now,
    }
})
const Transaction = mongoose.model('Transaction' , transactionSchema);
const User = mongoose.model('User', UserSchema);
const Account = mongoose.model('Accounts' ,accountSchema )
module.exports =  {User , Account , Transaction };
