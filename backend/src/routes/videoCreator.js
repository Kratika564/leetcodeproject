const express=require('express')
const adminMiddleware=require('../middleware/adminMiddleware')
const videoRouter=express.Router();
const {generateUploadSignature,saveVideoMetadata,deleteVideo}=require("../controllers/videoSection")

//there are 3 routes possible with videos menagement

videoRouter.get("/create/:problemId",adminMiddleware,generateUploadSignature);
videoRouter.post("/save",adminMiddleware,saveVideoMetadata);
videoRouter.delete("/delete/:problemId",adminMiddleware,deleteVideo);

module.exports=videoRouter;