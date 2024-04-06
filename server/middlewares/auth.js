const jwt=require("jsonwebtoken");
require("dotenv").config();
const User=require("../models/User");
// authorization
exports.auth = async(req,res,next) => {
    try{
        console.log("before token extraction");
    //extract token 3 methods -< token given in user db during login
    const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer","");
    console.log("After token extraction");
    if(!token){
        return res.status(401).json({
            success:false,
            message:"token is missing",
            error:error.message,
        });
    }
    //verify token
    try{
        const decode=jwt.verify(token,process.env.JWT_SECRET);
        console.log(decode);
        //user ke under decode dal diye hai jisme token ke sare components hai(i.e payload)
        req.user=decode;
    }
    catch(err){
        return res.status(401).json({
            success:false,
            message:"token is invalid",
            error:error.message,
        });
    }
    next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"something wrong while validatng token",
            error:error.message,
        });
    }
}
//is student
exports.isStudent = async(req,res,next) => {
    try{
        if(req.user.accountType!== "Student"){
            return res.status(401).json({
                success:false,
                message:"this is protected routes for the students",
                error:error.message,
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"user role cannot be verified",
            error:error.message,
        });
    }
}
//is instructor
exports.isInstructor = async(req,res,next) => {
    try{
        if(req.user.accountType!== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"this is protected routes for the Instructor",
                error:error.message,
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"user role cannot be verified",
            error:error.message,
        });
    }
}
//is admin'
exports.isAdmin = async(req,res,next) => {
    try{
        if(req.user.accountType!== "Admin"){
            return res.status(401).json({
                success:false,
                message:"this is protected routes for the Admin",
                error:error.message,
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"user role cannot be verified",
            error:error.message,
        });
    }
}


