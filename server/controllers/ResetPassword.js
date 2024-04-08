//click on reset pswd->send to u mail as frontend page of change the paswd->change the paswd->update the pswd on ur db
const User=require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt=require("bcrypt");
const crypto = require("crypto");

//reset password token
exports.resetPasswordToken = async(req,res) => {
    try{
        const email=req.body.email;
        //validation
        const user=await User.findOne({email:email});
        if(!user){
            return res.json({
                success:false,
                message:`this email is not registered with this ${email}`,
            });
        }
        //generate token via crypto
        const token=crypto.randomBytes(20).toString("hex");
        //update the details in user db with token and expiry
        const updatedDetails=await User.findByIdAndUpdate(
            {email:email},
            {
                token:token,
                resetPasswordExpires:Date.now()+3600000,
            },
            {new:true}
        );
        console.log("datails:",updatedDetails);
        //create url
        const url=`http://localhost:3000/update-password/${token}`;
        //send mail to email with url of reset paswd
        await mailSender(
            email,
            "Passwor dreset link",
            `link for email verification is ${url}. Please Click On this url to reset your password`
        );
        return res.json({
            success:true,
            message:"email sent successfully ,please check ur email for further process ",
        });
    }
    catch(error){
        return res.json({
            error:error.message,
            success:false,
            message:`some error in sending the reset message with this ${email}`,
        });
    }
}



//reset password
exports.resetPassword = async(req,res) => {
    try{
        //get details from req ki body
        const {password, confirmPassword,token}=req.body;
        //validation
        if(confirmPassword!==password){
            return res.json({
                success:false,
                message:"Password and confirm password are not matching"
            });
        }
        //find token
        const userDetails=await User.findOne({token:token});
        if(!userDetails){
            return res.json({
                success:false,
                message:"token is invalid"
            });
        }
        if (!(userDetails.resetPasswordExpires > Date.now())){
            return res.status(403).json({
                success:false,
                message:"token is expired,regenerate it"
            });
        }
        const encryptPassword = await bcrypt.hash(password,10);
        //update paswd in user db
        await User.findByIdAndUpdate(
            {token:token},
            {password:encryptPassword},
            {new:true}
        );
        return res.json({
            success:false,
            message:`Password reset successfully`
        });
    }
    catch(error){
        return res.json({
            error:error.message,
            success:false,
            message:"some error in updating the password"
        });
    }
}