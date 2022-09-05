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
        type: String,
        required : true,
        enum : ["Mr","Mrs","Miss"]
    },
    email : {
        type: String,
        unique: true,
        required: [ true,'Email address is required'],
       // validate: [validateEmail, 'Please fill a valid email address'],
       // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']

    },
    password : {
        type: String,
        required : true
        
    }

},{timestamps : true})

module.exports = mongoose.model('Auther', AuthorSchema)