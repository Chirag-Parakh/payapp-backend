const express = require("express")
const app = express();
const signupRoute = require('./routes/signup.js')
const signinRoute = require('./routes/signin.js')
const updateRoute = require('./routes/update.js')
const filterRoute = require('./routes/filter.js')
const bodyParser = require('body-parser');
app.use(bodyParser.json())

app.use('/signup' , signupRoute )
app.use('/signin' , signinRoute )
app.use('/update' , updateRoute )
app.use('/find' , filterRoute )

app.get('/' , (req , res) =>{
    res.send("this is index.js page");
})

app.listen(3000)