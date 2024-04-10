const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const {mongo,default:mongoose} = require("mongoose");

exports.createRating = async(req,res) => {
    try{
        const userId=req.user.id;
        //fetch data from req ki body
        const{rating,review,courseId}=req.body;
        //check if user is enrolled or not in course to make reating and review
        const courseDetails = await Course.findOne(
            {_id:courseId,
                   studentEnrolled:{$eleMatch:{$eq:userId}},//matching student enrolled in the course with given userid or not
            }
        );
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:'student is not enroolled in the course'
            });
        }
        //check if user is already reviewd the course or not once
        const alreadyReviewed = await RatingAndReview.findOne({
            user:userId,
            course:courseId
        });
        if(alreadyReviewed){
            return res.status(404).json({
                success:false,
                message:'course is already reviewed'
            });
        }
        //now create ratingand review
        const ratingReview = await RatingAndReview.create({
            rating,review,course:courseId,
            user:userId
        });
        //now update the course with rating and review id
        const updateCourseDetails = await Course.findByIdAndUpdate({_id:courseId},
                                     {
                                        $push:{
                                            ratingAndReviews:ratingReview._id,
                                        }
                                     }
        )
        crossOriginIsolated.log(updateCourseDetails);
        //return res
        return res.status(200).json({
            success:true,
            message:"rating and review created successfully",
            data:ratingReview,
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"unable to create rating and review for course"
        });
    }
}
//get average rating
exports.getAverageRating = async(req,res) => {
    try{
        const courseId=req.body.courseId;
        //cal avg rating
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseId),//converting string into object//match all the rating given for this course with given courseId
                },
            },
            {
                $group:{
                    _id:null,   //rating ko single entity ke under wrap/grouped kar diye hai
                    averageRating:{$avg:"$rating"}//taking avg of rating
                }
            }
        ])
        //return rating
        if(result.length>0){
            return res.status(200).json({
                success:true,
                message:"rating and review fetched",
                averageRating:result[0].averageRating,
            });
        }
        //if not rating and review exist for particular course
        return res.status(200).json({
            success:true,
            message:"average rating is zero becz not given by the user",
            averageRating:0
        
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}
//get all rating and reviews
exports.getAllRating = async(req,res) => {
    try{
        const allReviews = await RatingAndReview.find({})
                           .sort({rating:"desc"})
                           .populate({
                            path:"user",
                            select:"firstName lastName email image",
                           })
                           .populate({
                            path:"course",
                            select:"courseName",
                           })
                           .exec();
         return res.status(200).json({
            success:true,
            message:"All reviews fetched successfully",
            data:allReviews,
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}