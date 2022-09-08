const mongoose = require('mongoose')
const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const jwt = require("jsonwebtoken");
const moment = require("moment")

const isValidObjectId = function (ObjectId) { return mongoose.Types.ObjectId.isValid(ObjectId) }

const isValidreqbody = function (body) {
  return Object.keys(body).length > 0
}

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false
  if (typeof value === "string" && value.trim().length === 0) return false
  return true
}
// _____________________________POST BLOG__________________________
const createBlog = async function (req, res) {
  try {
    let data = req.body
    
    if (!isValidreqbody(data)) {
      return res.status(400).send({ status: false, msg: "Please Provide Blog Datails" })
    }
    const { title, body, authorId, tags, category, subcategory } = req.body
    let author = await authorModel.findById(authorId)

    if (!isValid(title) || !isValid(body)) {
      return res.status(400).send({ status: false, msg: "Please Enter Some data In title Or body" })
    }
    if (!isValidObjectId(authorId)) {
      return res.status(400).send({ status: false, msg: "Please Provide authorId" })
    }
    if (!author) {
      return res.status(400).send({ status: false, msg: "Please Provide Valid authorId" })
    }
    if (!data.tags) {
      return res.status(400).send({ status: false, msg: "Please Provide tags to the blog" })
    }
    if (!isValid(category)) {
      return res.status(400).send({ satust: false, msg: "Please Provide Categary" })
    }
    if (!isValid(subcategory)) {
      return res.status(400).send({ status: false, msg: "Please provide Subcategary" })
    }

    let savedBlog = await blogModel.create(data)
    res.status(201).send({ msg: savedBlog })
  }
  catch (err) {
    res.status(500).send({ status: false, Error: err.message })
  }
}

// ________________________________GET BLOG DATA USING QUERY PARAMS_________________________________

const getBlog = async function (req, res) {
  try {
    let data = req.query
    const { category, authorId, tags, subcategory } = data

    let author = await authorModel.findById(authorId)
    if (!authorId) {
      return res.status(400).send({ status: false, msg: "Please enter author ID " })
    }
    else if (!author) {
      return res.status(404).send({ status: false, msg: "author ID not found" })
    }
    if (!category) {
      return res.status(400).send({ status: false, msg: "category not found" })
    }
    if (!tags) {
      return res.status(400).send({ status: false, msg: "tags not found" })
    }
    if (!subcategory) {
      return res.status(400).send({ status: false, msg: "subcategory not found" })
    }
    let checkData = await blogModel.find({ isDeleted: false, isPublished: true })

    let user = await blogModel.find({ authorId: data.authorId })

    if (!user) {
      return res.status(404).send({ status: false, msg: "data not found!!" })
    }
    res.status(200).send({ status: true, data: checkData })
  }
  catch (err) {
    res.status(500).send({ status: false, Error: err.message })
  }
}


// ___________________________UPDATE BLOG DATA USING PATH PARAMS_________________________________________________

const updateBlog = async function (req, res) {
  try {
    let getBlogId = req.params.blogId;  // blog id will be taken from request param

    //blogId is valid or not
    if (!isValidObjectId(getBlogId))
      return res.status(404).send({ status: false, msg: "Enter a valid Object Id" });

    //Finding the blogid in data base
    let findBlogId = await blogModel.findById(getBlogId)
    if (!findBlogId)
      return res.status(404).send({ status: false, msg: "No blog exists" });

    // //finding the data is delted or not
    if (findBlogId.isDeleted)
      return res.status(404).send({ status: findBlogId, msg: "No blog founds or has been already deleted" });

    let { ...data } = req.body;

    // if data value is empty
    if (Object.keys(data).length == 0)
      return res.status(400).send({ status: false, msg: "data is requierd to update" });

    //update the blog data in data base by blog id

    let updateBlog = await blogModel.findByIdAndUpdate(
      { _id: getBlogId },
      {
        $push: { tags: data.tags, category: data.category, subcategory: data.subcategory },
        title: data.title,
        body: data.body,
        isPublished: data.isPublished
      },
      { new: true }
    )

    if ((!findBlogId.isPublished) && updateBlog.isPublished) {
      let timeStamp = moment(new Date()).format('DD/MM/YYYY  h:mma')
      let updateData = await blogModel.findOneAndUpdate(
        { _id: getBlogId },  //finding id 
        { publishedAt: timeStamp },
        { new: true }

      )
      return res.status(200).send({ statusbar: true, data: updateData });
    }

    res.status(200).send({ status: true, data: updateBlog });
  } catch (err) {
    res.status(500).send({ status: false, Error: err.message });
  }
};

// ________________________________DELETE BLOG USING PATH PARAMS_________________________________

const deleteBlogByPathParams = async function (req, res) {
  try {
    let blogId = req.params.blogId;

    let blog = await blogModel.findById(blogId)
    //check the blog is present or not
    if (!blog) {
      return res.status(404).send({ status: false, msg: "No such user exists" });
    }

    //check isDeleted satus is true
    if (blog.isDeleted) {
      return res.status(400).send({ status: false, msg: "Blog is already Delete" });
    }
    //update the status of Isdeleted to true
    let updatedData = await blogModel.findOneAndUpdate({ _id: blogId }, { isDeleted: true }, { new: true })
    return res.status(200).send({ status: true, data: updatedData });
  }
  catch (err) {
    res.status(500).send({ status: false, Error: err.message })
  }
}

// ___________________________DELETE USING QUERY PARAMS_________________________________________________

const deletedBlogByQueryParam = async function (req, res) {
  try {
    let { ...data } = req.query;
    let token = req.headers["x-api-key"];
    let decodedToken = jwt.verify(token, "Project1-Group45");
    // let decodedToken = req.decodedToken;

    //validating the data for empty values
    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Error!" });

    if (data.hasOwnProperty('authorId')) { // authorId is present or not
      if (!isValidObjectId(data.authorId))
        return res.status(400).send({ status: false, msg: "Enter a valid author Id" });

      if (decodedToken.authorId !== data.authorId)
        return res.status(403).send({ status: false, msg: "Action not allow" })


      let { ...oldData } = data;
      delete (oldData.authorId);
    }

    let timeStamps = moment(new Date()).format('DD/MM/YYYY  h:mma') //getting the current timeStamps

    let getBlogData = await blogModel.find({ authorId: decodedToken.authorId, data });

    //blog doesnt match with  query data
    if (getBlogData.length == 0) {
      return res.status(404).send({ status: false, msg: "No blog found" });
    }

    const getNotDeletedBlog = getBlogData.filter(item => item.isDeleted === false);

    if (getNotDeletedBlog.length == 0) {
      return res.status(404).send({ status: false, msg: "The Blog is already deleted" });
    }

    data.authorId = decodedToken.authorId;

    let updatedData = await blogModel.updateMany({ authorId: data.authorId }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })
    return res.status(200).send({ status: true, data: updatedData })

  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

module.exports = { createBlog, getBlog, updateBlog, deleteBlogByPathParams, deletedBlogByQueryParam }
