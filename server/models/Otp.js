const mongoose = require("mongoose");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");
const mailSender = require("../utils/mailSender");
const OTPSchema = new mongoose.Schema({
	email:{
		type: String,
		required: true,
	},
	otp:{
		type: String,
		required: true,
	},
	createdAt:{
		type: Date,
		default: Date.now,
		expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
	},
});

// //  apke user ke db me entry save hone se phle otp jayega mail pe aur agr otp sahi hui toh db me entry hogi
// // use of pre middlewares 
// // otp wale model ke under mail send ka code likh dete hai ->ffrom nodemailer utils code to here

// //function ->to sending emails
// Define a function to send emails
async function sendVerificationEmail(email, otp) {
	// Create a transporter to send emails

	// Define the email options

	// Send the email
	try {
		const mailResponse = await mailSender(
			email,
			"Verification Email From Study-Mania",
			emailTemplate(otp)
		);
		console.log("Email sent successfully: ", mailResponse.response);
	} catch (error) {
		console.log("Error occurred while sending email: ", error);
		throw error;
	}
}
// // document save hone se phle ek verificiation mail jayega ,uske verify(user ka otp req.body se aur db me store otp same hone ke) baad aage jayenge aur db me store hoga user ka details
// //defining a post save hook to send email after the document has been saved
OTPSchema.pre("save", async function (next) {
	console.log("New document saved to database");
    // this means current
	// Only send an email when a new document is created
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
	//aage ka step karo mail bhejne ke baad ka kaam
	next();
});

const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;

