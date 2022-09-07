const jwt = require("jsonwebtoken");
const authorModel = require("../models/authorModel");
const userModel = require("../models/blogModel");
const mongoose = require('mongoose')

const isValidObjectId = function (ObjectId) { return mongoose.Types.ObjectId.isValid(ObjectId) }

const authentication = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) token = req.headers["x-api-key"];

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
    res.status(500).send({msg: "Error", error: err.message })
  }
}

const authorization = async function (req, res, next) {
    try {
      let token = req.headers["x-api-key"]; //uthaying token from header
      token = req.headers["x-api-key"];
      let decodedToken = jwt.verify(token, "Project1-Group45"); //verify token with secret key 
      let loginInUser = decodedToken.authorId; //log in by token
      let authorLogin = req.query;
  
      if (!authorLogin)
      return res.status(400).send({ status: false, msg: "Author id is required" })  // author id is not present in params

      if (req.body.hasOwnProperty('authorId')); //it is finding that auther is present in data or not
      //autherid is valid or not
    //   let data = await authorModel.findById(authorId)
      if (!isValidObjectId(req.query.authorId))
        return res.status(400).send({ status: false, msg: "valid auther id likho" })
      authorLogin = req.body.authorId;
  
      
      if (req.params.hasOwnProperty('blogId')) {   //blog id is present in req 
  
        if (!isValidObjectId(req.params.blogId))
          return res.status(400).send({ status: false, msg: "enter valid id blog" })
  
        let blogData = await blogModel.findById(req.params.blogId);
  
        if (!blogData)
          return res.status(404).send({ status: false, msg: "Error! check blogId" })
  
  
        authorLogin = blogData.authorId.toString(); //getting author from blog data and convert kar do string
      }   
  
    //   if (loginInUser !== authorLogin)
        // return res.status(400).send({ status: false, msg: "Error failed" })  //if login user is not author of that blog
  
      next(); //if auther is same then go to your page
  
    } catch (err) {
      res.status(500).send({ status: false, msg: err.message });
    }
  
  }

module.exports = {authentication, authorization}