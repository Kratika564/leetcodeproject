const jwt=require('jsonwebtoken')
const User=require('../models/user')
const redisClient = require("../config/redis");

const adminMiddleware=async(req,res,next)=>{
    try{
        const {token}=req.cookies
        if(!token)
            throw new Error('Token is not present')
           const payload=jwt.verify(token,process.env.JWT_KEY)
           const {_id}=payload;
           if(!_id){
            throw new Error('invalid token')
           }
          //need to make the token by role also to prevent multiple db calls
        if(payload.role!='admin')
            throw new Error("Invalid Token, the login user must have to be admin for adminregister");

           const result=await User.findById(_id);
           if(!result)
            throw new Error('user Does not exist')
          //check in redis blocklist

          const IsBlocked=await redisClient.exists(`token:${token}`);
          if(IsBlocked)
            throw new Error('Invalid Token')

        req.result=result;
     //   console.log("adminmiddleware")
        next();
    }
    catch(err)
    {
       res.status(401).send("Error "+err.message)
    }
}
module.exports=adminMiddleware;