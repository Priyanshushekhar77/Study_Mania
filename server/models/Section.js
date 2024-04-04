const mongoose=require("mongoose");
const SectionSchema = new mongoose.Schema({
    sectionName:{
        type:String,
        required:true,
    },
    //section includes multiple subse ctions so store in an array
    subSection:[
        {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"SubSection",
    },
    ],
},
{timestamps: true});
module.exports = mongoose.model("Section",SectionSchema);