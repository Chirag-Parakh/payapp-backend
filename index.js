const express = require("express")
const app = express();
const signupRoute = require('./routes/signup.js')
const signinRoute = require('./routes/signin.js')
const bodyParser = require('body-parser');
app.use(bodyParser.json())

app.use('/signup' , signupRoute )
app.use('/signin' , signinRoute )

app.get('/' , (req , res) =>{
    res.send("this is index.js page");
})

app.listen(3000)