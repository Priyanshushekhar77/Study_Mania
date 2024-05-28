const mongoose = require("mongoose")
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const CourseProgress = require("../models/CourseProgress")
const Course = require("../models/Course")

exports.updateCourseProgress = async(req,res) =>{
    const { courseId, subsectionId } = req.body
  const userId = req.user.id
  try{
    //check if subsection is valid or not
    const subSection = await SubSection.findById(subsectionId)
    if(!subSection){
        return res.status(404).json({ error: "Invalid subsection" })
    }
    //find the course progress document for the user and course
    let courseProgress = await CourseProgress.findOne({
        courseId:courseId,
        userId:userId,
    })
    if(!courseProgress){
        // If course progress doesn't exist, create a new one
      return res.status(404).json({
        success: false,
        message: "Course progress Does Not Exist",
      })
    }
    else{
        //if courseprogress exists,than check if the subsection is already completed or not
        if(courseProgress.completedVideos.includes(subsectionId)){
            return res.status(400).json({ error: "Subsection already completed" }) 
        }
        //now push the completed subsection into the completed videos array
        courseProgress.completedVideos.push(subsectionId)
    }
    // Save the updated course progress
    await courseProgress.save()
    return res.status(200).json({
      success:true, 
      message: "Course progress updated" })
  }
  catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Internal server error" })
  }
};