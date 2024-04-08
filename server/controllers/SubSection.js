const Section = require("../models/Section");
const SubSection=require("../models/SubSection");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

//create a new subsection
exports.createSubSection = async(req,res) => {
    try{
           const{sectionId,title,description} = req.body;
           const video=req.files.video;
        //    const pdfs=req.files.pdfs; do letter this system on backend
        if(!sectionId || !title || !description || !video){
            return res.status(404).json({
                success:false,
                message:"All fields are required to filled",
                data:course,
            })
        }
        console.log(video);
        //update the video file to cloudinary
        const updateDetails = await uploadImageToCloudinary(
            video,
            process.env.FOLDER_NAME
        )
        console.log(updateDetails)
        //create a new subsection
        const SubSectionDetails = await SubSection.create({
            title:title,
            timeDuration:`${uploadDetails.duration}`,
            description:description,
            videoUrl:updateDetails.secure_url,
        })
        // update the corresponding section with newly subsection id
       const updatedSection = await Section.findByIdAndUpdate(
        {_id:sectionId},
        {$push:{subSection:SubSectionDetails._id}},
        {new:true},
       ).populate("subsection")
       //return res
       return res.status(200).json({
        success:true,
        message:"subsection created successfully",
        data:updatedSection,
       })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"section cannot be created",
            error:error.message
        });
    }
}
exports.updateSubSection = async(req,res) => {
    try{
        const {sectionId,subSectionId,title,description} = req.body;
        const subSection = await SubSection.findById(subSectionId)
        if(!subSection){
            return res.status(404).json({
                success:false,
                message:"subsection not found",
                error:error.message
            });
        }
        if(title!==undefined){
            subSection.title=title;
        }
        if(description!==undefined){
            subSection.description=description;
        }
        if(req.files && req.files.video!==undefined){
            const video=req.files.video;
            const uploadDetails=await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME,
            )
            subSection.videoUrl=uploadDetails.secure_url
            subSection.timeDuration=`${uploadDetails.duration}`
        }
        await subSection.save();
        const updatedSection = await Section.findById(sectionId).populate("subSection")
            return res.status(200).json({
                success:true,
                data:updatedSection,
                message:"subsection updated successfully",
            });
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"error occures on updating subsection",
            error:error.message
        });
    }
}

exports.deleteSubSection = async(req,res) => {
    try{
        const{subSectionId,sectionId}=req.body;
        await Section.findByIdAndUpdate(
            {_id:sectionId},
            {
                $pull:{
                    subSection:subSectionId,
                },
            }
        )
        const subSection = await SubSection.findByIdAndDelete({_id:subSectionId})
        if(!subSection){
            return res.status(404).json({
                success:false,
                message:"subsection not found",
                error:error.message
            });
        }
        const updatedSection = await Section.findById(sectionId).populate("subSection")
        return res.status(200).json({
            success:true,
            message:"subsection deleted successfully",
            data:updatedSection
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"subsection can n ot be deleted",
            error:error.message
        });
    }
}