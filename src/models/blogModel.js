const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId


const blogSchema = new mongoose.Schema({

    title : {
        type: String,
        required : true,
    },
    body : {
        type: String,
        required: true
    },
    authorId : {
        type: String,
        required : true,
        ref: Auther
    },
    tags : {
        type: string
    },
    category: {
        type: string,
        mandatory: ["technology", "entertainment", "life style", "food, fashion"]
    },
    subcategory : {
       type: string
    },
    createdAt : { 
        type: Date, required: true, default: Date.now 
    },
    updatedAt:new Date(),

    deletedAt: {
         type: Date,
        default: null
    },
    isDeleted: {
        boolean, default: false
    },
    publishedAt: {
        type: String,
    },
    isPublished: {
        type: Boolean,
        default: false,
    }




},{timestamps : true})

module.exports = mongoose.model('blog', blogSchema)