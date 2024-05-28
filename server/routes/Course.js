// Import the required modules
const express = require("express")
const router = express.Router()
 //course controller importin

 const {
    createCourse,
    getAllCourses,
    getCourseDetails,
    getFullCourseDetails,
    editCourse,
    getInstructorCourses,
    deleteCourse,
  } = require("../controllers/Course")

  //categories controller importing
  const {
    showAllCategories,
    createCategory,
    categoryPageDetails,
  } = require("../controllers/Category")

  //section controller importing
  const {
    createSection,
    updateSection,
    deleteSection,
  } = require("../controllers/Section")

  //subsection controller importing
  const {
    createSubSection,
    updateSubSection,
    deleteSubSection,
  } = require("../controllers/SubSection")
//Rating controller importing
const {
    createRating,
    getAverageRating,
    getAllRatingReview,
  } = require("../controllers/RatingAndReview")

  //courseprogress controller importing
  const {
    updateCourseProgress,
  } = require("../controllers/CourseProgress")

  //importing middlewares
  const {auth,isInstructor,isStudent,isAdmin} = require("../middlewares/auth")

  //course routes
  //1/course can only created by the instructor
  router.post("/createCourse",auth,isInstructor,createCourse)
  //edit course route
  router.post("/editCourse",auth,isInstructor,editCourse)
  // delete courses
  router.delete("/deleteCourse",auth,isInstructor,deleteCourse)
  // 2.SECTIONS
  //add a section to the course
  router.post("/addSection",auth,isInstructor,createSection)
  //update a section
  router.post("/updateSection",auth,isInstructor,updateSection)
  //delete a section
  router.post("/deleteSection",auth,isInstructor,deleteSection)
//3.SUBSECTIONS

// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection)
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)


//letter
//get all courses under a specific Instructor
router.get("/getInstructorCourses",auth,isInstructor,getInstructorCourses)
// //get all registered courses
router.get("/getAllCourses",getAllCourses)
// // Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)
// Get Details for a Specific Courses
//later
router.post("/getFullCourseDetails", auth, getFullCourseDetails)


//to update a course progress under a student
//letter
router.post("/updateCourseProgress",auth,isStudent,updateCourseProgress)


// To get Course Progress
// router.post("/getProgressPercentage", auth, isStudent, getProgressPercentage)

//for admins
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)

//for RATING AND REVIEW
router.post("/createRating",auth,isStudent,createRating)
router.get("/getAverageRating",getAverageRating)
router.get("/getReviews",getAllRatingReview)


module.exports=router;

