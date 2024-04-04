const mongoose=require("mongoose");
const CourseProgressSchema = new mongoose.Schema({
    //ref as course
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    //multiple videos
    completedVideos:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubSection",
    },
    ],
});
module.exports = mongoose.model("CourseProgress",CourseProgressSchema);