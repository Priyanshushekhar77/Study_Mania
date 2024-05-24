// const jwt=require("jsonwebtoken");
// require("dotenv").config();
// const User=require("../models/User");
// // authorization
// exports.auth = async(req,res,next) => {
//     try{
//         console.log("before token extraction");
//     //extract token 3 methods -< token given in user db during login
//     const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer","");
//     console.log("After token extraction");
//     //IF TOKEN MISSING
//     if(!token){
//         return res.status(401).json({
//             success:false,
//             message:"token is missing",
//             error:error.message,
//         });
//     }
//     //verify token
//     try{
//         console.log("verify token")
//         const decode= await jwt.verify(token,process.env.JWT_SECRET);
//         console.log(decode);
//         //user ke under decode dal diye hai jisme token ke sare components hai(i.e payload)
//         req.user=decode;
//         console.log("verify token failed")
//     }
//     catch(err){
//         return res.status(401).json({
//             success:false,
//             message:"token is invalid",
//         });
//     }
//     // If JWT is valid, move on to the next middleware or request handler
//     next();
//     }
//     // If there is an error during the authentication process, return 401 Unauthorized response
//     catch(error){
//         return res.status(401).json({
//             success:false,
//             message:"something wrong while validatng token",
//             error:error.message,
//         });
//     }
// }
// //is student
// exports.isStudent = async(req,res,next) => {
//     try{
//         if(req.user.accountType!== "Student"){
//             return res.status(401).json({
//                 success:false,
//                 message:"this is protected routes for the students",
//                 error:error.message,
//             });
//         }
//         next();
//     }
//     catch(error){
//         return res.status(500).json({
//             success:false,
//             message:"user role cannot be verified",
//             error:error.message,
//         });
//     }
// }
// //is instructor
// exports.isInstructor = async(req,res,next) => {
//     try{
//         if(req.user.accountType!== "Instructor"){
//             return res.status(401).json({
//                 success:false,
//                 message:"this is protected routes for the Instructor",
//                 error:error.message,
//             });
//         }
//         next();
//     }
//     catch(error){
//         return res.status(500).json({
//             success:false,
//             message:"user role cannot be verified",
//             error:error.message,
//         });
//     }
// }
// //is admin'
// exports.isAdmin = async(req,res,next) => {
//     try{
//         if(req.user.accountType!== "Admin"){
//             return res.status(401).json({
//                 success:false,
//                 message:"this is protected routes for the Admin",
//                 error:error.message,
//             });
//         }
//         next();
//     }
//     catch(error){
//         return res.status(500).json({
//             success:false,
//             message:"user role cannot be verified",
//             error:error.message,
//         });
//     }
// }


// Importing required modules
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");
// Configuring dotenv to load environment variables from .env file
dotenv.config();

// This function is used as middleware to authenticate user requests
exports.auth = async (req, res, next) => {
	try {
		// Extracting JWT from request cookies, body or header
		const token =
			req.cookies.token ||
			req.body.token ||
			req.header("Authorisation").replace("Bearer ", "");

		// If JWT is missing, return 401 Unauthorized response
		if (!token) {
			return res.status(401).json({ success: false, message: `Token Missing` });
		}

		try {
			// Verifying the JWT using the secret key stored in environment variables
			const decode = await jwt.verify(token, process.env.JWT_SECRET);
			console.log(decode);
			// Storing the decoded JWT payload in the request object for further use
			req.user = decode;
		} catch (error) {
			// If JWT verification fails, return 401 Unauthorized response
			return res
				.status(401)
				.json({ success: false, message: "token is invalid" });
		}

		// If JWT is valid, move on to the next middleware or request handler
		next();
	} catch (error) {
		// If there is an error during the authentication process, return 401 Unauthorized response
		return res.status(401).json({
			success: false,
			message: `Something Went Wrong While Validating the Token`,
		});
	}
};
exports.isStudent = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });

		if (userDetails.accountType !== "Student") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Students",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};
exports.isAdmin = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });

		if (userDetails.accountType !== "Admin") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Admin",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};
exports.isInstructor = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });
		console.log(userDetails);

		console.log(userDetails.accountType);

		if (userDetails.accountType !== "Instructor") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Instructor",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};
