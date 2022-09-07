const jwt = require("jsonwebtoken");
const authorModel = require("../models/authorModel");
const userModel = require("../models/blogModel");

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

module.exports = {authentication}