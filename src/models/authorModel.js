const mongoose = require('mongoose')


const AuthorSchema = new mongoose.Schema({

    fname :{
        type : String,
        required : true
    },
    lname : {
        type  : String,
        required : true
    },
    title : {
        required : true,
        enum : [Mr,Mrs,Miss]
    },
    email : {
        type : String,
        unique : true
    },
    password : {
        required : true
    }

},{timestamps : true})


module.exports = mongoose.model('Auther', AuthorSchema)