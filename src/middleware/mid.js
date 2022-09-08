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

        let newToken = req.decodedToken
        let login = req.params.authorId

        if (newToken != login) {
            return res.status(400).send({ status: false, msg: "acesses deny" })
        }

        next(); //if auther is same then go to your page

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}

module.exports = { authentication, authorization }