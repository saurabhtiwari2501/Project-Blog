const mongoose = require('mongoose')
const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")

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

    if (!isValid(title) || !isValid(body)) {
      return res.status(400).send({ status: false, msg: "Please Enter Some data In title Or body" })
    }
    if (!isValidObjectId(authorId)) {
      return res.status(400).send({ status: false, msg: "Please Provide authorId" })
    }
    if (!isValid(authorId)) {
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
    let authorId = data.authorId
    let category = data.category
    let tags = data.tags
    let subcategory = data.subcategory

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

    let user = await blogModel.find({ $and: [{ authorId: authorId }, { category: category }, { tags: tags }, { subcategory: subcategory }] })

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

  let data = req.query;
  const { category, authorId, tags, subcategory, publishedAt, ...rest } = data

  if (!isValidreqbody(req.query)) {
    return res.status(400).send({ status: false, msg: "Data Is Not Passes In Query" })
  }
  
    if (!isValid(category)) {
      return res.status(400).send({ status: false, msg: "Please Enter valid Categary" })
    }
  if (!isValidObjectId(authorId)) {
    return res.status(400).send({ status: false, msg: "invalid author id" })
  }
  
    if (!isValid(tags)) {
      return res.status(400).send({ status: false, msg: "Please Enter valid tags" })
    }
 
    if (!isValid(subcategory)) {
      return res.status(400).send({ status: false, msg: "Please Enter valid Subcategary" })
    }

    if (!isValid(publishedAt)) {
      return res.status(400).send({ status: false, msg: "Please Enter valid publishedAt" })
    }
  if (rest.length >= 0) {
    return res.status(400).send({ status: false, msg: "bad request" })
  }

  const blog = await blogModel.findOne({ authorId: authorId, isDeleted: false })
  if (blog) {
    return res.status(404).send({ status: false, mag: "Blog Not Found or already deleted" });
  }
 
  let updatedData = await blogModel.updateMany({ isDeleted: true }, { new: true })
  if(updatedData){
    return res.status(404).send({ status: false, mag: "Blog Not Found or already deleted" });
  }
  return res.status(200).send({ status: true, data: updatedData })
  
}

module.exports = { createBlog, getBlog, updateBlog, deleteBlogByPathParams, deletedBlogByQueryParam }
