const jwt = require("jsonwebtoken");
const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");
const mongoose = require('mongoose')

const isValidObjectId = function (ObjectId) { return mongoose.Types.ObjectId.isValid(ObjectId) }

const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) token = req.headers["X-Api-Key"];

        //If no token is present in the request header return error. This means the user is not logged in.
        if (!token) return res.status(400).send({ status: false, msg: "token must be present" });

        let decodedToken = jwt.verify(token, "Project1-Group45");
        if (!decodedToken) {
            return res.status(401).send({ status: false, msg: "token is invalid" });
        }

        req.loggedInAuthorId = decodedToken._id

        next()
    }
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

const authorization = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]; //uthaying token from header
        token = req.headers["x-api-key"];
        let decodedToken = jwt.verify(token, "Project1-Group45"); //verify token with secret key 
        let loginInUser = decodedToken.authorId; //log in by token
        let authorLogin = req.query.authorId;
        // if (req.body.hasOwnProperty('authorId'));
        // if (!authorLogin)
        //     return res.status(400).send({ status: false, msg: "Author id is required" })  // author id is not present in params

        //it is finding that auther is present in data or not
        //autherid is valid or not

        // if (!isValidObjectId(req.query.authorId))
        //     return res.status(400).send({ status: false, msg: "Please enter valid author Id" })

        if (req.params.hasOwnProperty('blogId')) {   //blog id is present in req 

            if (!isValidObjectId(req.params.blogId))
                return res.status(400).send({ status: false, msg: "enter valid id blog" })

            let blogData = await blogModel.findById(req.params.blogId);

            if (!blogData)
                return res.status(404).send({ status: false, msg: "Error! check blogId" })
        }

        if (loginInUser !== authorLogin)
            return res.status(400).send({ status: false, msg: "Error failed" })  //if login user is not author of that blog

        next();
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}

// const authorization = async function(req, res, next) {
//     try{
//     let requestedUserId = req.params.blogId
// // console.log(requestedUserId)
//     let blog = await blogModel.findById({_id: requestedUserId})
//     // console.log(blog)
//     if(blog.authorId !== req.loggedInAuthorId) {
//     return res.status(403).send({status: false, msg: 'Permission Denied!!'})
// }
//     next()
// }
// catch (err) {
//     res.status(500).send({ msg: "Error", error: err.message })

// }
// }
module.exports = { authentication, authorization }