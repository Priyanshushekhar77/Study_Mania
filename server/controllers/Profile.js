const Course = require("../models/Course");
const Profile=require("../models/Profile")
const User=require("../models/User")
const {uploadImageToCloudinary} = require("../utils/imageUploader")
exports.updateProfile = async(req,res)=> {
    try{
        const{dateOfBirth="",about="",contactNumber}=req.body;
        const id=req.user.id;
        //find the profile by id
        const userDetails=await User.findById(id);
        const profile=await Profile.findById(userDetails.additionalDetails);
        //upfate the profile fields
        profile.dateOfBirth=dateOfBirth;
        profile.about=about;
        profile.contactNumber=contactNumber;
        //saved the updated profile
        await profile.save();
        return res.status(200).json({
            success:true,
            message:"Profile updated successfully",
            profile,
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Profile updation failed",
            error:error.message
        });
    }
};
exports.deleteAccount = async(req,res)=> {
    try{
        const id=req.user.id;
        const user=await User.findById({_id:id});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"user not found",
                error:error.message
            });
        }
        //now delete the associated profile with the user
        await Profile.findByIdAndDelete({_id:user.additionalDetails});
        //todo letter-> unenroll the user from all the enrolled courses
        //now delete the user
        await User.findByIdAndDelete({_id:id});
        return res.status(200).json({
            success:true,
            message:"user deleted successfully",
        });
    } catch(error){
        return res.status(500).json({
            success:false,
            message:"user cannot be deleted",
            error:error.message
        });
    }
};

exports.getAllUserDetails = async(req,res) => {
    try{
        const id=req.user.id;
        const userDetails=await User.findById(id)
                        .populate("additionalDetails")
                        .exec();
        console.log(userDetails);
        return res.status(200).json({
            success:true,
            message:"user data fetched successfully",
            data:userDetails
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"user data cannot be fetched",
            error:error.message
        });
    }
};
exports.updateDisplayPicture = async(req,res) => {
    try{
        const displayPicture=req.files.displayPicture
        const userId=req.user.id;
        const image=await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        console.log(image)
        const updateProfile = await User.findByIdAndUpdate(
            {_id:userId},
            {image:image.secure_url},
            {new:true}
        )
        return res.status(200).json({
            success:true,
            message:"profile picture updated",
            data:updateProfile,
        });
    } catch(error){
        return res.status(500).json({
            success:false,
            message:"profile picture can't be updated",
            error:error.message
        });
    }
};
exports.getEnrolledCourses = async(req,res)=> {
    try{
        const userId=req.user.id
        const userDetails = await User.findOne({
            _id:userId,
        })
        .populate("courses")
        .exec()
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"can't find user",
                error:error.message,
            });
        }
        return res.status(200).json({
            success:true,
            message:"fetched enrolled courses of user",
            data:userDetails.courses,
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"can't get enrolled courses of user",
            error:error.message
        });
    }
};


//letter
exports.instructorDashboard = async(req,res) => {
    try{
        const courseDetails = await Course.find({instructor:re.user.id})
        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentEnrolled.length
            const totalAmountGenerated = totalStudentsEnrolled * course.price
              // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }
      return courseDataWithStats
        })
    
    res.status(200).json({ courses: courseData })
}catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
}
}