const jwt = require('jsonwebtoken');
const JWT_SECRET = require("./config");

const userMiddleware = (req , res , next) => {
    try{
        const bearertoken = req.headers.authorization;
        const token = bearertoken.split(' ')[1]
        const verify = jwt.verify(token ,JWT_SECRET)
        if(!verify){
           return res.json({message : "invalid user"});
        }
        next();
    }catch(error){
        res.status(500).json({message : "error occured"  , error : error})
    }
}

module.exports = userMiddleware;