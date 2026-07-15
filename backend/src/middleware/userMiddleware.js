const jwt=require('jsonwebtoken')
const User=require('../models/user')
const redisClient = require("../config/redis")
const userMiddleware=async(req,res,next)=>{
    try{
        const {token}=req.cookies
        if(!token)
            throw new Error('Token is not present')
           const payload=jwt.verify(token,process.env.JWT_KEY)
           const {_id}=payload;
           if(!_id){
            throw new Error('invalid token')
           }
           const result=await User.findById(_id);
           if(!result)
            throw new Error('user Does not exist')
          //check in redis blocklist
          const IsBlocked=await redisClient.exists(`token:${token}`);
          if(IsBlocked)
            throw new Error('Invalid Token')

        req.result=result;
     
        next();
    }
    catch(err)
    {
       res.status(401).send("Error "+err.message)
    }
}
module.exports=userMiddleware;