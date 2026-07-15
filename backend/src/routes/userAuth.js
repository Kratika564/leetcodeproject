const express=require('express')
const authRouter=express.Router();
const {register, login,logout, adminRegister,deleteProfile} = require('../controllers/userAuthent')
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require('../middleware/adminMiddleware');

//Register
authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',userMiddleware,logout);
authRouter.post('/admin/register', adminMiddleware ,adminRegister);
authRouter.delete('/deleteProfile',userMiddleware,deleteProfile);
//create a route for check that user already sign in or not means token in cookie come or not 
//if cookie not come means expired that redirect user to sigup or login page
authRouter.get('/check',userMiddleware,(req,res)=>{
    //user middleware checkcookie come or not if not come then send responce
    //else send user info to prevent databse call becoz usermiddleware already assigned ka user in req.result

    const reply={
        firstName:req.result.firstName,
        emailId:req.result.emailId,
        _id:req.result._id
    }

    res.status(200).json({
        user:reply,
        message:"Valid User"
    });
})
//authRouter.get('getProfile',getProfile);

//login
//logout
//GetProfile
module.exports=authRouter

