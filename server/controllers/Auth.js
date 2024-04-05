const User=require("../models/User");
const OTP=require("../models/OTP");
const otpGenerator=require("otp-generator");



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
    })
   }
}



//2. signup controller for registering users



//3.  login controller for authenticating users


//4. controller for change password