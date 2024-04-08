const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

//create a new section
exports.createSection = async(req,res) => {
    try{
        //extract the field from req,body
        const {sectionName,courseId} = req.body;
        //validate the input
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"all fields are required to field",
                error:error.message
            });
        }
        //create a new section
        const newSection = await Section.create({sectionName})
        //add this new sectionId to the course contents array
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    courseContent:newSection._id,
                },
            },
            {new:true}
        )
        .populate({
            path:"courseContent",
            populate:{
                path:"subSection",
            },
        })
        .exec();
        //return the updated course object in the esponse with populated
        return res.status(200).json({
            success:true,
            message:"section created successfully",
            updatedCourse,
        });
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"section cannot be created",
            error:error.message
        });
    }
}
//update a section
exports.updateSection = async(req,res) => {
    try{
        const{sectionName,sectionId,courseId} = req.body;
        const section = await Section.findByIdAndDelete(
            sectionId,
            {sectionName},
            {new:true}
        );
        const course = await Course.findById(courseId)
          .populate({
            path:"courseContent",
            populate:{
                path:"subsection",
            },
          })
          .exec();
          return res.status(200).json({
            success:true,
            message:"section updated successfully",
            data:course,
    });
}catch(error){
    return res.status(500).json({
            success:false,
            message:"section cannot be created",
            error:error.message
        });
}
}
//delete a section
exports.deleteSection = async(req,res)=> {
    try{
        const {sectionId,courseId} = req.body;
        await Course.findByIdAndUpdate(courseId,{
            $pull:{
                courseContent:sectionId
            }
        })
        const section = await Section.findById(sectionId)
        console.log(sectionId,courseId)
        if(!section){
            return res.status(404).json({
                success:false,
                message:"section not found",
                error:error.message
            });
        }
        //delete sub section
        await SubSection.deleteMany({_id:{$in:section.subSection}});

        //delete section
        await Section.findByIdAndDelete(sectionId);
        //find the updated course and return
        const course = await Course.findById(courseId).populate({
            path:"courseContent",
            populate:{
                path:"subSection"
            }
        })
        .exec();
        return res.status(200).json({
            success:true,
            message:"section deleted successfully",
            data:course,
    });
    }
    catch(error){
        console.log("error deleting section")
        return res.status(500).json({
            success:false,
            message:"section cannot be created",
            error:error.message
        });
    }
}