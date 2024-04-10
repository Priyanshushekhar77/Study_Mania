const User=require("../models/User");
const OTP=require("../models/OTP");
const otpGenerator=require("otp-generator");
const mailSender = require("../utils/mailSender");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const {passwordUpdated} = require("../mail/templates/passwordUpdate");
const Profile=require("../models/Profile");
require("dotenv").config();


//1. controller for send OTP and email verification
exports.sendotp=async(req,res) => {
   try{
     //fetch email from req ki body
     const {email} = req.body;
     //check if user is already present in db
     const checkUser=await User.findOne({email});
     //if user exist than return
     if(checkUser){
         return res.status(401).json({
             success:false,
             message:"user already exist"
         })
     }
     //generate otp
     var otp=otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
     });
     console.log("generated otp is",otp);
     //ye otp db me exist karta hai ya nhi
     const validotp=await OTP.findOne({otp:otp});
     // agar karta hai yoh unique otp generate karo 
     while(validotp){
        otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
        });
     }
     // otpPayload for otp db
    const otpPayload={email,otp};
    //create an entry in otp db
    const otpBody=await OTP.create(otpPayload);
    console.log("otpbody",otpBody);
    //return response
    res.status(200).json({
        success:true,
        message:"OTP sent successfully",
        otp
    })
   }
   catch(error){
    console.log(error.message);
    return res.status(500).json({
        success:false,
        message:error.message,
    });
   }
};



//2. signup controller for registering users
exports.signup=async(req,res) => {
    try{
        //data fetching from req body
        const{firstName,lastName,email,password,confirmPassword,accountType,contactNumber,otp} = req.body;
        //validate
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"All fields are required"
            });
        }
        //match password
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"password and confirmpassword are not matching"
            });
        }
        //check if user already exist
        const existinguser=await User.findOne({email});
        if(existinguser){
            return res.status(400).json({
                success:false,
                message:"User already registered"
            });
        }
        //find the most recent otp for the email in db
        //sort in dec order and get one particular val
        const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
		console.log(response);
		if (response.length === 0) {
			// OTP not found for the email
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		} else if (otp !== response[0].otp) {
			// Invalid OTP
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		}
        //hash password
        const hashedPassword=await bcrypt.hash(password,10);
        ////approval
        let approved="";
        approved==="Instructor" ? (approved = false) : (approved = true);
        //additional profile for user
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null
        });
        //create user in the db
        const user=await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType:accountType,
            approved:approved,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
        });
        return res.status(200).json({
            success:true,
            user,
            message:"user registered successfully"
        });
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"user cannot be registered"
        });
    }
};


//3.  login controller for authenticating users
exports.login = async(req,res) => {
    try{
        const {email,password} = req.body;
        //validation if missing
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required to filled"
            });
        }
        //find user exist or not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"user is not registered"
            });
        }
        //generate jwt token after compare password
        if(await bcrypt.compare(password,user.password)){
            const token=jwt.sign(
                {email:user.email, id:user._id, accountType:user.accountType},//payload for jwt
                process.env.JWT_SECRET,
                {expiresIn: "24h"}
            );
        //save this token to user db
        user.token=token;
        user.password=undefined;
        //set cookies for token and return success response
        const options = {
            expires:new Date(Date.now() + 2 * 24 *60 *60 * 1000),
            httpOnly:true,
        };
        //SET COOKIE FOR TOKEN send token in response with cookie
        res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user,
            message:`user login success`,
        });
    }
        else{
            return res.status(401).json({
                success:false,
                message:"password is not correct"
            });
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"login failure"
        });
    }
};

//4. controller for change password
exports.changePassword = async(req,res) => {
   try{
     //get user data from req body
     const userDetails = await User.findById(req.user.id);//get userdetails by req.user.id
     
		// Get old password, new password, and confirm new password from req.body
     const{oldPassword, newPassword, confirmNewPassword}=req.body;
     // Validate old password
     const passwordMatch=await bcrypt.compare(oldPassword,userDetails.password);
     if(!passwordMatch){
         return res.status(401).json({
             success:false,
             message:"password is incorrect"
         });
     }
     // Match new password and confirm new password
     if(newPassword !== confirmNewPassword){
         return res.status(400).json({
             success:false,
             message:"password and confirmpassword not matching"
         });
     }
     //update pswd in the db
     const encryptPassword=await bcrypt.hash(newPassword,10);
     const updateUserDetails = await User.findByIdAndUpdate(
         req.user.id,
         { password:encryptPassword},
         {new:true}//return new updated status in response
     );
     //send notification in email for updated pswd
     try{
         const emailResponse = await mailSender(
             updateUserDetails.email,
             passwordUpdated(
                 updateUserDetails.email,
                 `password updated successfully for ${updateUserDetails.firstName} ${updateUserDetails.lastName}`
             )
         );
         console.log("email sent successfully",emailResponse.response);
     }catch(error){
         console.log("error occured during sending mail",error);
         return res.status(500).json({
             success:false,
             message:"error occured during sending mail",
             error:error.message,
         });
     }
     return res.status(200).json({
         success:true,
         message:"Password updated successfully",
     })
   }

    catch(error){
        console.log("error occured during updating password",error);
        return res.status(500).json({
            success:false,
            message:"error occured during updating password",
            error:error.message,
        });
    }
};