const mongoose = require("mongoose")

mongoose.connect('mongodb+srv://cparakh53:VsR0suwDAa7XjbEs@chiraglearn.7ynaqrk.mongodb.net/payapp')
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Error connecting to MongoDB:", err));

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: [true, "Username already exists"],
        minLength: [8, "Username must be at least 8 characters long"],
        maxLength: [30, "Username cannot be longer than 30 characters"],
        validate: {
            validator: (username) => {
                return /[a-z]/.test(username) && /[A-Z]/.test(username);
            },
            message: "Username must contain both uppercase and lowercase characters"
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        minLength: [8, "Password must be at least 8 characters long"],
        validate: {
            validator: (password) => {
                return /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%&*?]/.test(password);
            },
            message: "Password must contain an uppercase letter, a lowercase letter, a number, and a special character"
        }
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: (email) => {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            },
            message: "Invalid email address"
        }
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


const User = mongoose.model('User', UserSchema);

module.exports =  User ;
