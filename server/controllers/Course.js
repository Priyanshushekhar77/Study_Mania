// const Course=require("../models/Course")
// const Category=require("../models/Category");
// const Section=require("../models/Section");
// const SubSection=require("../models/SubSection")
// const User=require("../models/User")
// const {uploadImageToCloudinary} = require("../utils/imageUploader")
// const CourseProgress=require("../models/CourseProgress")
// const {convertSecToDuration} = require("../utils/secToDuration")

// //course creation
// exports.createCourse = async(req,res) => {
//     try{
//         //get user id from req object-> during authz process we have handover req.user =decode(it contains all token details)
//         const userId=req.user.id
//         // get all req filled from req body
//         let {
//             courseName,
//             courseDescription,
//             whatYouWillLearn,
//             price,
//             tag,//string array
//             category,
//             status,
//             instructions
//         }=req.body
//       //get thumbnail image from req.files
//       const thumbnail=req.files.thumbnailImage
//       // convert the tag and instructions from stringified array to array
//       // const tag=JSON.parse(_tag);
//       // const instructions=JSON.parse(_instructions)
//       console.log("tag:" ,tag)
//       console.log("instructions:" ,instructions)
//       //validation 
//       if(
//             !courseName ||
//             !courseDescription ||
//             !whatYouWillLearn ||
//             !price ||
//             !tag.length ||
//             !thumbnail ||
//             !category ||
//             !instructions.length
//       ){
//         return res.status(400).json({
//             success:false,
//             message:"All fields are mandatory to filled"
//         })
//       }
//       if(!status || status ===undefined) {
//         status="Draft"
//       }
//       //check user is an instructor to create a course
//       const instructorDetails = await User.findById(userId,{
//         accountType:"Instructor",
//       })
//       if(!instructorDetails){
//         return res.status(404).json({
//             success:false,
//             message:"instructor details are not found to create a course"
//         })
//       }
//       //check given tag is valid
//       const categoryDetails=await Category.findById(category)
//       if(!categoryDetails){
//         return res.status(404).json({
//             success:false,
//             message:"category details not found"
//         })
//       }
//       //upload the thumbnail to cloudinary
//       const thumbnailImage=await uploadImageToCloudinary(
//         thumbnail,
//         process.env.FOLDER_NAME
//       )
//       console.log(thumbnailImage)
//       //now create a course and add to db
//       const newCourse = await Course.create({
//         courseName,
//         courseDescription,
//         instructor:instructorDetails._id,
//         whatYouWillLearn:whatYouWillLearn,
//         price,
//         tag:tag,
//         category:categoryDetails._id,
//         thumbnail:thumbnailImage.secure_url,
//         status:status,
//         instructions:instructions,
//       })
//       // add this new course to user schema of the instructor
//       const userUpdated = await User.findByIdAndUpdate({
//         _id:instructorDetails._id
//       },
//       {
//         $push:{
//             courses:newCourse._id,
//         },
//       },
//       {new :true}
//     )
//     //add this new course to category schema
//      const categoryUpdated = await Category.findByIdAndUpdate(
//         {
//             _id:categoryDetails._id
//         },
//         {
//             $push:{
//                 courses:newCourse._id,
//             },
//         },
//         {new:true}
//      )
//      console.log("category updated:",categoryUpdated)
//      return res.status(200).json({
//         success:true,
//         data:newCourse,
//         message:"course created successfully"
//     })
//     }
//     catch(error){
//         return res.status(500).json({
//             success:false,
//             message:"course creation failed",
//             error:error.message,
//         })
//     }
// }
// //getall courses controller
// exports.getAllCourses = async(req,res) => {
//     try{
//         const allCourses = await Course.find(
//             {status:"Published"},
//             {
//                 courseName:true,
//                 price:true,
//                 thumbnail:true,
//                 instructor:true,
//                 ratingAndReviews:true,
//                 studentEnrolled:true,
//             }
//         )
//         .populate("instructor")
//         .exec()
//         return res.status(200).json({
//           success:true,
//           data:allCourses,
//           message:"course fetched successfully"
//       })
//     }
//     catch(error){
//       return res.status(404).json({
//         success:false,
//         message:`can't fetched courses data`,
//         error:error.message
//     })
//     }
// }
// // get particular course details
// exports.getCourseDetails = async(req,res) => {
//   try{
//     const {courseId}=req.body;
//     const courseDetails = await Course.findOne({
//       _id:courseId,
//     })
//     .populate({
//       path:"instructor",
//        populate:{
//         path:"additionalDetails",
//        },
//     })
//     .populate("category")
//     // .populate("ratingAndReviews") currently not present
//      .populate({
//       path:"courseContent",
//       populate:{
//         path:"subSection",
//         // select:"videoUrl",
//       },
//      })
//      .exec()
//      if(!courseDetails){
//       return res.status(400).json({
//         success:false,
//         message:`couldn't find course with given${courseId}`,
//         error:error.message,
//     })
//      }

//        //return response
//        return res.status(200).json({
//         success:true,
//         message:"Course Details fetched successfully",
//         data:courseDetails,
//     })

// }
//   //    //todo for last
//   //    let totalDurationInSeconds = 0
//   //    courseDetails.courseContent.forEach((content) => {
//   //     content.SubSection.forEach((SubSection) => {
//   //       const timeDurationInSeconds = parseInt(SubSection.timeDuration)
//   //       totalDurationInSeconds+=totalDurationInSeconds
//   //     })
//   //    })
//   //    const totalDuration = convertSecToDuration(totalDurationInSeconds)
//   //    return res.status(200).json({
//   //     success:true,
//   //     message:"course details fetched completely",
//   //     data:{
//   //       courseDetails,
//   //       totalDuration,
//   //     },
//   // })
  
//   catch(error){
//     return res.status(500).json({
//       success:false,
//       message:"course fetched failed",
//       error:error.message,
//   })
//   }
// }
// //1.todo for last
// //get full course details 
// exports.getFullCourseDetails = async(req,res) => {
//   try{
//     const {courseId}=req.body;
//     const userId=req.user.id;
//     const courseDetails = await Course.findOne({
//       _id:courseId,
//     })
//     .populate({
//       path:"instructor",
//        populate:{
//         path:"additionalDetails",
//        },
//     })
//     .populate("category")
//     .populate("ratingAndReviews")
//      .populate({
//       path:"courseContent",
//       populate:{
//         path:"subSection",
//       },
//      })
//      .exec()
//      let courseProgressCount = await CourseProgress.findOne({
//       courseId:courseId,
//       userId:userId,
//     })
//     console.log("courseprogresscount is:",courseProgressCount)
//      if(!courseDetails){
//       return res.status(400).json({
//         success:false,
//         message:`couldn't find course with given${courseId}`,
//         error:error.message,
//     })
//      }
//      let totalDurationInSeconds = 0
//      courseDetails.courseContent.forEach((content) => {
//       content.SubSection.forEach((SubSection) => {
//         const timeDurationInSeconds = parseInt(SubSection.timeDuration)
//         totalDurationInSeconds += totalDurationInSeconds
//       })
//      })
//      const totalDuration = convertSecToDuration(totalDurationInSeconds)
//      return res.status(200).json({
//       success:true,
//       message:"course details fetched completely",
//       data:{
//         courseDetails,
//         totalDuration,
//         completedVideos:courseProgressCount?.completedVideos? courseProgressCount?.completedVideos:[],
//       },
//   })
//   }
//   catch(error){
//     return res.status(500).json({
//       success:false,
//       message:"getfullcourse details fetched failed",
//       error:error.message,
//   })
//   }
// }
// //2.todo for lasts
// // get a list of all courses for a particular given instructor
// exports.getInstructorCourses = async(req,res) => {
//   try{
//     //get the instructorid from the authenticationn user or req body
//     const instructorId=req.user.id;
//     //find all courses belonging to that instructor
//     const instructorCourses = await Course.find({
//       instructor:instructorId,
//     }).sort({createdAt: -1}) //descending order
//     //return the instructor's courses
//     return res.status(200).json({
//       success:true,
//       message:"instructor course fetched",
//       data:instructorCourses,
//   })
//   }
//   catch(error){
//     console.log(error)
//     return res.status(500).json({
//       success:false,
//       message:"failed to retrive instructor courses" ,
//       error:error.message,
//   })
//   }
// }
// //3.todo for lasts
// //edit course details controller
// exports.editCourse = async(req,res) => {
//   try{
//      const {courseId}=req.body;
//      const updates=req.body;
//      const course=await Course.findById(courseId);
//      if(!course){
//       return res.status(404).json({
//         success:false,
//         message:"course not found",
//         error:error.message
//     })
//      }
//      //if thumbnail image is foud for updation
//      if(req.files){
//       console.log("thumbnail updation");
//       const thumbnail=req.files.thumbnailImage
//       const thumbnailImage=await uploadImageToCloudinary(
//         thumbnail,
//         process.env.FOLDER_NAME
//       )
//       // course me thumbnail ka updation
//       course.thumbnail=thumbnailImage.secure_url
//      }
//      //updates the fields that are present in the req body
//      for(const key in updates){
//       if(updates.hasOwnProperty(key)){
//         if(key==="tag" || key==="instructions"){
//           course[key] = json.parse(updates[key])//stringify array to array
//         }
//         else{
//           course[key]=updates[key];
//         }
//       }
//      }
//      await course.save();
//      const updatedCourse = await Course.findOne({
//       _id:courseId,
//      })
//      .populate({
//       path:"instructor",
//       populate:{
//         path:"additionalDetails",
//       },
//      })
//      .populate("category")
//      .populate("ratingAndReviews")
//      .populate({
//       path:"courseContent",
//       populate:{
//         path:"subSection",
//       },
//      })
//      .exec()
//      return res.status(200).json({
//       success:true,
//       data:updatedCourse,
//       message:"course edited successfully",
//   })
//   }
//   catch(error){
//     return res.status(500).json({
//       success:false,
//       message:"course doesnot updated",
//       error:error.message
//   })
//   }
// }
// //4.todo for lasts
// //delete the course
// exports.deleteCourse = async(req,res) => {
//   try{
//     const {courseId } = req.body;
//     //find the course
//     const course = await Course.findById(courseId);
//     if(!course){
//       return res.status(404).json({
//         success:false,
//         message:"course not found",
//         error:error.message,
//     })
//     }
//     //unenroll all the students from this deleteing course
//     const studentEnrolled = course.studentEnrolled
//      for(const studentId of studentEnrolled){
//         await User.findByIdAndUpdate(studentId,{
//           $pull:{course:courseId},
//         })
//      }

//      //delete section and subsection of this course
//      const courseSections=course.courseContent
//      for(const sectionId of courseSections){
//       //delete subsection of section
//       const section = await Section.findById(sectionId)
//       if(section){
//         const subSections = section.subSection
//         for(const subSectionId of subSections){
//           await SubSection.findByIdAndDelete(subSectionId)
//         }
//       }
//       //delete the section
//       await Section.findByIdAndDelete(sectionId)
//      }
//      //now delete the course
//      await Course.findByIdAndDelete(courseId)
//      //send the res
//      return res.status(200).json({
//       success:true,
//       message:"course deleted successfully",
//   })

//   }
//   catch(error){
//     return res.status(500).json({
//       success:false,
//       message:"course deletion failed",
//       error:error.message
//   })
//   }
// }




const Course = require("../models/Course")
const Category = require("../models/Category")
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const User = require("../models/User")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
const CourseProgress = require("../models/CourseProgress")
const { convertSecondsToDuration } = require("../utils/secToDuration")
// Function to create a new course
exports.createCourse = async (req, res) => {
  try {
    // Get user ID from request object
    const userId = req.user.id

    // Get all required fields from request body
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag: _tag,
      category,
      status,
      instructions: _instructions,
    } = req.body
    // Get thumbnail image from request files
    const thumbnail = req.files.thumbnailImage

    // Convert the tag and instructions from stringified Array to Array
    const tag = JSON.parse(_tag)
    const instructions = JSON.parse(_instructions)

    console.log("tag", tag)
    console.log("instructions", instructions)

    // Check if any of the required fields are missing
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag.length ||
      !thumbnail ||
      !category ||
      !instructions.length
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      })
    }
    if (!status || status === undefined) {
      status = "Draft"
    }
    // Check if the user is an instructor
    const instructorDetails = await User.findById(userId, {
      accountType: "Instructor",
    })

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details Not Found",
      })
    }

    // Check if the tag given is valid
    const categoryDetails = await Category.findById(category)
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      })
    }
    // Upload the Thumbnail to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    )
    console.log(thumbnailImage)
    // Create a new course with the given details
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status: status,
      instructions,
    })

    // Add the new course to the User Schema of the Instructor
    await User.findByIdAndUpdate(
      {
        _id: instructorDetails._id,
      },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    )
    // Add the new course to the Categories
    const categoryDetails2 = await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    )
    console.log("HEREEEEEEEE", categoryDetails2)
    // Return the new course and a success message
    res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course Created Successfully",
    })
  } catch (error) {
    // Handle any errors that occur during the creation of the course
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    })
  }
}
// Edit Course Details
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const updates = req.body
    const course = await Course.findById(courseId)

    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update")
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key])
        } else {
          course[key] = updates[key]
        }
      }
    }

    await course.save()

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
// Get Course List
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      { status: "Published" },
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec()

    return res.status(200).json({
      success: true,
      data: allCourses,
    })
  } catch (error) {
    console.log(error)
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    })
  }
}
// Get One Single Course Details
// exports.getCourseDetails = async (req, res) => {
//   try {
//     const { courseId } = req.body
//     const courseDetails = await Course.findOne({
//       _id: courseId,
//     })
//       .populate({
//         path: "instructor",
//         populate: {
//           path: "additionalDetails",
//         },
//       })
//       .populate("category")
//       .populate("ratingAndReviews")
//       .populate({
//         path: "courseContent",
//         populate: {
//           path: "subSection",
//         },
//       })
//       .exec()
//     // console.log(
//     //   "###################################### course details : ",
//     //   courseDetails,
//     //   courseId
//     // );
//     if (!courseDetails || !courseDetails.length) {
//       return res.status(400).json({
//         success: false,
//         message: `Could not find course with id: ${courseId}`,
//       })
//     }

//     if (courseDetails.status === "Draft") {
//       return res.status(403).json({
//         success: false,
//         message: `Accessing a draft course is forbidden`,
//       })
//     }

//     return res.status(200).json({
//       success: true,
//       data: courseDetails,
//     })
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     })
//   }
// }
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "-videoUrl",
        },
      })
      .exec()

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}
// Delete the Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}
