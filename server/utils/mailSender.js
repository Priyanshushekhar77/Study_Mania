const nodemailer = require("nodemailer");

const mailSender = async(email,title,body) => {
    try{
        // CREATING TRANSPORTER(createTransport)
         let transporter= nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            },
            secure:false,
         })
        //  MAIL SEND KARTE HAI(sendMail) 
        let info= await transporter.sendMail({
            from: `'Study-Mania => study with fun' <${process.env.MAIL_USER}>` ,//sender address
            to:`${email}`, //list of receivers mail
            subject:`${title}`, //subject line
            html:`${body}`, //html  body
        })
        console.log(info.response);//printing
        return info; //optional
    }
    catch (error){
        console.log(error.message);
        return error.message
    }
}
module.exports = mailSender;