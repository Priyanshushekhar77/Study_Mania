const mongoose=require("mongoose");
const courseSchema = new mongoose.Schema({
    courseName: {
        type:String,
        required:true,
        trim:true,
    },
    courseDescription: {
        type:String,
        required:true,
        trim:true,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    whatYouWillBeLearn:{
        type:String,
    },
    //includes multiple sections and its ref is section
    courseContent:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section",
    }
    ],
    //includes multiple rating and reviews and its ref 
    ratingAndReviews:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview",
    }
    ],
    price:{
        type:Number,
        required:true,
        
    },
    thumbNail:{
        type:String,
    },
    // kaun sa tag ka ye partucular course hai
    tag:{
        type:[String],
    },
    //catg of course and its ref is category
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
    },
    //includes multiple students and its ref is user
    studentsEnrolled:[{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
],
// course ke liye diff types ka instructions
instructions:{
    type:[String],
},
//current status of courses
status:{
    type:String,
    enum:["Draft","Published"],
},
createdAt:{
    type:Date,
    default:Date.now
}
},
{timestamps: true}
);
module.exports = mongoose.model("Course",courseSchema);

// const mongoose = require("mongoose");

// // Define the Courses schema
// const coursesSchema = new mongoose.Schema({
// 	courseName: { type: String },
// 	courseDescription: { type: String },
// 	instructor: {
// 		type: mongoose.Schema.Types.ObjectId,
// 		required: true,
// 		ref: "user",
// 	},
// 	whatYouWillLearn: {
// 		type: String,
// 	},
// 	courseContent: [
// 		{
// 			type: mongoose.Schema.Types.ObjectId,
// 			ref: "Section",
// 		},
// 	],
// 	ratingAndReviews: [
// 		{
// 			type: mongoose.Schema.Types.ObjectId,
// 			ref: "RatingAndReview",
// 		},
// 	],
// 	price: {
// 		type: Number,
// 	},
// 	thumbnail: {
// 		type: String,
// 	},
// 	tag: {
// 		type: [String],
// 		required: true,
// 	},
// 	category: {
// 		type: mongoose.Schema.Types.ObjectId,
// 		// required: true,
// 		ref: "Category",
// 	},
// 	studentsEnrolled: [
// 		{
// 			type: mongoose.Schema.Types.ObjectId,
// 			required: true,
// 			ref: "user",
// 		},
// 	],
// 	instructions: {
// 		type: [String],
// 	},
// 	status: {
// 		type: String,
// 		enum: ["Draft", "Published"],
// 	},
// 	createdAt: {
// 		type:Date,
// 		default:Date.now
// 	},
// });

// // Export the Courses model
// module.exports = mongoose.model("Course", coursesSchema);
