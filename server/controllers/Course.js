const Course=require("../models/Course")
const Category=require("../models/Category");
const Section=require("../models/Section");
const SubSection=require("../models/SubSection")
const User=require("../models/User")
const {uploadImageToCloudinary} = require("../utils/imageUploader")
const CourseProgress=require("../models/CourseProgress")
const {convertSecToDuration} = require("../utils/secToDuration")

//course creation
exports.createCourse = async(req,res) => {
    try{
        //get user id from req object-> during authz process we have handover req.user =decode(it contains all token details)
        const userId=req.user.id
        // get all req filled from req body
        let {
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            tag:_tag,//string array
            category,
            status,
            instructions:_instructions,
        }=req.body
      //get thumbnail image from req.files
      const thumbnail=req.files.thumbnailImage
      // convert the tag and instructions from stringified array to array
      const tag=JSON.parse(_tag);
      const instructions=JSON.parse(_instructions)
      console.log("tag:" ,tag)
      console.log("instructions:" ,instructions)
      //validation 
      if(
            !courseName ||
            !courseDescription ||
            !whatYouWillLearn ||
            !price ||
            !tag.length ||
            !thumbnail ||
            !category ||
            !instructions.length
      ){
        return res.status(400).json({
            success:false,
            message:"All fields are mandatory to filled"
        })
      }
      if(!status || status ===undefined) {
        status="Draft"
      }
      //check user is an instructor to create a course
      const instructorDetails = await User.findById(userId,{
        accountType:"Instructor",
      })
      if(!instructorDetails){
        return res.status(404).json({
            success:false,
            message:"instructor details are not found to create a course"
        })
      }
      //check given tag is valid
      const categoryDetails=await Category.findById(category)
      if(!categoryDetails){
        return res.status(404).json({
            success:false,
            message:"category details not found"
        })
      }
      //upload the thumbnail to cloudinary
      const thumbnailImage=await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      console.log(thumbnailImage)
      //now create a course and add to db
      const newCourse = await Course.create({
        courseName,
        courseDescription,
        instructor:instructorDetails._id,
        whatYouWillLearn:whatYouWillLearn,
        price,
        tag,
        category:categoryDetails._id,
        thumbnail:thumbnailImage.secure_url,
        status:status,
        instructions,
      })
      // add this nre course to user schema of the instructor
      const userUpdated = await User.findByIdAndUpdate({
        _id:instructorDetails._id
      },
      {
        $push:{
            courses:newCourse._id,
        },
      },
      {new :true}
    )
    //add this new course to category schema
     const categoryUpdated = await Category.findByIdAndUpdate(
        {
            _id:categoryDetails._id
        },
        {
            $push:{
                courses:newCourse._id,
            },
        },
        {new:true}
     )
     console.log("category updated:",categoryUpdated)
     return res.status(200).json({
        success:true,
        data:newCourse,
        message:"course created successfully"
    })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"course creation failed",
            error:error.message,
        })
    }
}
//getall courses controller
exports.getAllCourses = async(req,res) => {
    try{
        const allCourses = await Course.find(
            {status:"Published"},
            {
                courseName:true,
                price:true,
                thumbnail:true,
                instructor:true,
                ratingAndReviews:true,
                studentEnrolled:true,
            }
        )
        .populate("instructor")
        .exec()
        return res.status(200).json({
          success:true,
          data:allCourses,
          message:"course fetched successfully"
      })
    }
    catch(error){
      return res.status(404).json({
        success:false,
        message:`can't fetched courses data`,
        error:error.message
    })
    }
}
// get particular course details
exports.getCourseDetails = async(req,res) => {
  try{
    const {courseId}=req.body;
    const courseDetails = await Course.findOne({
      _id:courseId,
    })
    .populate({
      path:"instructor",
       populate:{
        path:"additionalDetails",
       },
    })
    .populate("category")
    .populate("ratingAndReviews")
     .populate({
      path:"courseContent",
      populate:{
        path:"subSection",
        select:"videoUrl",
      },
     })
     .exec()
     if(!courseDetails){
      return res.status(400).json({
        success:false,
        message:`couldn't find course with given${courseId}`,
        error:error.message,
    })
     }
     let totalDurationInSeconds = 0
     courseDetails.courseContent.forEach((content) => {
      content.SubSection.forEach((SubSection) => {
        const timeDurationInSeconds = parseInt(SubSection.timeDuration)
        totalDurationInSeconds+=totalDurationInSeconds
      })
     })
     const totalDuration = convertSecToDuration(totalDurationInSeconds)
     return res.status(200).json({
      success:true,
      message:"course details fetched completely",
      data:{
        courseDetails,
        totalDuration,
      },
  })
  }
  catch(error){
    return res.status(500).json({
      success:false,
      message:"course fetched failed",
      error:error.message,
  })
  }
}
//get full course details 
exports.getFullCourseDetails = async(req,res) => {
  try{
    const {courseId}=req.body;
    const userId=req.user.id;
    const courseDetails = await Course.findOne({
      _id:courseId,
    })
    .populate({
      path:"instructor",
       populate:{
        path:"additionalDetails",
       },
    })
    .populate("category")
    .populate("ratingAndReviews")
     .populate({
      path:"courseContent",
      populate:{
        path:"subSection",
      },
     })
     .exec()
     let courseProgressCount = await CourseProgress.findOne({
      courseId:courseId,
      userId:userId,
    })
    console.log("courseprogresscount is:",courseProgressCount)
     if(!courseDetails){
      return res.status(400).json({
        success:false,
        message:`couldn't find course with given${courseId}`,
        error:error.message,
    })
     }
     let totalDurationInSeconds = 0
     courseDetails.courseContent.forEach((content) => {
      content.SubSection.forEach((SubSection) => {
        const timeDurationInSeconds = parseInt(SubSection.timeDuration)
        totalDurationInSeconds += totalDurationInSeconds
      })
     })
     const totalDuration = convertSecToDuration(totalDurationInSeconds)
     return res.status(200).json({
      success:true,
      message:"course details fetched completely",
      data:{
        courseDetails,
        totalDuration,
        completedVideos:courseProgressCount?.completedVideos? courseProgressCount?.completedVideos:[],
      },
  })
  }
  catch(error){
    return res.status(500).json({
      success:false,
      message:"getfullcourse details fetched failed",
      error:error.message,
  })
  }
}
// get a list of all courses for a particular given instructor
exports.getInstructorCourses = async(req,res) => {
  try{
    //get the instructorid from the authenticationn user or req body
    const instructorId=req.user.id;
    //find all courses belonging to that instructor
    const instructorCourses = await Course.find({
      instructor:instructorId,
    }).sort({createdAt: -1}) //descending order
    //return the instructor's courses
    return res.status(200).json({
      success:true,
      message:"instructor course fetched",
      data:instructorCourses,
  })
  }
  catch(error){
    console.log(error)
    return res.status(500).json({
      success:false,
      message:"failed to retrive instructor courses" ,
      error:error.message,
  })
  }
}
//edit course details controller
exports.editCourse = async(req,res) => {
  try{
     const {courseId}=req.body;
     const updates=req.body;
     const course=await Course.findById(courseId);
     if(!course){
      return res.status(404).json({
        success:false,
        message:"course not found",
        error:error.message
    })
     }
     //if thumbnail image is foud for updation
     if(req.files){
      console.log("thumbnail updation");
      const thumbnail=req.files.thumbnailImage
      const thumbnailImage=await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      // course me thumbnail ka updation
      course.thumbnail=thumbnailImage.secure_url
     }
     //updates the fields that are present in the req body
     for(const key in updates){
      if(updates.hasOwnProperty(key)){
        if(key==="tag" || key==="instructions"){
          course[key] = json.parse(updates[key])//stringify array to array
        }
        else{
          course[key]=updates[key];
        }
      }
     }
     await course.save();
     const updatedCourse = await Course.findOne({
      _id:courseId,
     })
     .populate({
      path:"instructor",
      populate:{
        path:"additionalDetails",
      },
     })
     .populate("category")
     .populate("ratingAndReviews")
     .populate({
      path:"courseContent",
      populate:{
        path:"subSection",
      },
     })
     .exec()
     return res.status(200).json({
      success:true,
      data:updatedCourse,
      message:"course edited successfully",
  })
  }
  catch(error){
    return res.status(500).json({
      success:false,
      message:"course doesnot updated",
      error:error.message
  })
  }
}
//delete the course
exports.deleteCourse = async(req,res) => {
  try{
    const {courseId } = req.body;
    //find the course
    const course = await Course.findById(courseId);
    if(!course){
      return res.status(404).json({
        success:false,
        message:"course not found",
        error:error.message,
    })
    }
    //unenroll all the students from this deleteing course
    const studentEnrolled = course.studentEnrolled
     for(const studentId of studentEnrolled){
        await User.findByIdAndUpdate(studentId,{
          $pull:{course:courseId},
        })
     }

     //delete section and subsection of this course
     const courseSections=course.courseContent
     for(const sectionId of courseSections){
      //delete subsection of section
      const section = await Section.findById(sectionId)
      if(section){
        const subSections = section.subSection
        for(const subSectionId of subSections){
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }
      //delete the section
      await Section.findByIdAndDelete(sectionId)
     }
     //now delete the course
     await Course.findByIdAndDelete(courseId)
     //send the res
     return res.status(200).json({
      success:true,
      message:"course deleted successfully",
  })

  }
  catch(error){
    return res.status(500).json({
      success:false,
      message:"course deletion failed",
      error:error.message
  })
  }
}


