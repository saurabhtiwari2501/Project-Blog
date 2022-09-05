const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true
    },
    authorId: {
        type: ObjectId,
        required: true,
        ref: "Author"
    },
    tags: {
        type: [string]
    },
    category: {
        type: [string],
        required: true
    },
    subcategory: {
        type: [string]
    },
    deletedAt: {
        type: String
    },
    isDeleted: {
        type: Boolean, 
        default: false
    },
    publishedAt: {
        type: String
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    
}, { timestamps: true })

module.exports = mongoose.model('Blog', blogSchema)