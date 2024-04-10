const {mongoose} = require("mongoose");
const category = require("../models/Category");
function getRandomInt(max){
    return Math.floor(Math.random()*max)
}

exports.createCategory = async(req,res) => {
    try{
        //get details from req body
        const {name,description} = req.body;
        //validation
        if(!name){
            return res.status(400).json({
                success:false,
                message:"all fields are required to filled "
            });
        }
        //create in db
        const categoryDetails=await category.create({
            name:name,
            description:description
        });
        console.log(categoryDetails);
        //return res
        return res.status(200).json({
            success:true,
            message:"category created successfully"
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
};

exports.showAllCategories= async(req,res) => {
    try{
        //find all category
        const allCategories=await category.find({});
        return res.status(200).json({
            success:true,
            data:allCategories
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
};
//particular category page details
exports.categoryPageDetails = async(req,res) => {
    try{
        const {categoryId}=req.body;
        //get course for specified category
        const selectedCategory=await category.findById(categoryId).populate({
            path:"courses",
            match:{status:"Published"},
            populate:"ratingandReviews",
        })
        .exec()
        if(!selectedCategory){
            console.log("category not found");
            return res.status(404).json({
                success:false,
                message:"category not found"
            });
        }
        //validation when there is no course
        if(selectedCategory.courses.length===0){
            console.log("No course found");
            return res.status(404).json({
                success:false,
                message:"No course found for selected categoryid"
            });
        }
        //get courese of other categories  and populate their course
        const categoriesExceptSelected=await category.find({
            _id:{$ne:categoryId},
        })
        let differentCategory=await category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
            ._id
        )
        .populate({
            path:"courses",
            match:{status:"Published"},
        })
        .exec()
        //getting topselling course
        const allCourses=allCategories.flatMap((category) => category.courses)
        const mostSellingCourses=allCourses.sort((a,b) => b.sold-a.sold)
                                            .slice(0,10)
                                            return res.status(200).json({
                                                success:true,
                                                data:{
                                                    selectedCategory,
                                                differentCategory,
                                                mostSellingCourses,
                                                }
                                            });                                

        }
        catch(error){
            return res.status(500).json({
                success:false,
                message:"internal server error",
                error:error.message
            });
        }
    }
