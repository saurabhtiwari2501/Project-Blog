const jwt = require("jsonwebtoken");
const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");
const mongoose = require('mongoose')

const isValidObjectId = function (ObjectId) { return mongoose.Types.ObjectId.isValid(ObjectId) }

// ________________________________MIDDLEWARE FOR AUTHENTICATION_________________________________

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

// ________________________________MIDDLEWARE FOR AUTHORIZATION_________________________________

const authorization = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]; //uthaying token from header
        token = req.headers["x-api-key"];
        let decodedToken = jwt.verify(token, "Project1-Group45"); //verify token with secret key 
        let loginInUser = decodedToken.authorId; //log in by token
        let authorLogin = req.query.authorId;

        if (!authorLogin)
            return res.status(400).send({ status: false, msg: "Author id is required" })  // author id is not present in params

        if (req.body.hasOwnProperty('authorId')); //it is finding that auther is present in data or not

        if (!isValidObjectId(req.query.authorId))
            return res.status(400).send({ status: false, msg: "valid auther id likho" })


        if (req.params.hasOwnProperty('blogId')) { //blogId is present in request params

            //checking whether the blogId is valid or not
            if (!isValidObjectId(req.params.blogId))
                return res.status(400).send({ status: false, msg: "Enter a valid blog Id" })

            let blogData = await blogModel.findById(req.params.blogId);

            if (!blogData)
                return res.status(404).send({ status: false, msg: "Error, Please check Id and try again" });

        }

        if (loginInUser !== authorLogin)
            return res.status(400).send({ status: false, msg: "Error failed" })  //if login user is not author of that blog

        next(); //if auther is same then go to your page

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }

}

module.exports = { authentication, authorization }