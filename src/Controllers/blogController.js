const mongoose = require('mongoose')
const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const ObjectId = require("mongoose").Types.ObjectId
const isValidObjectId = function (ObjectId) {  return mongoose.Types.ObjectId.isValid(ObjectId) }

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
  // try {
  let data = req.body


  if (!isValidreqbody(data)) {
    return res.status(400).send({ status: false, msg: "Please Provide Blog Datails" })
  }

  const { title, body, authorId, tags, category, subcategory, isPublished } = req.body

  if (!isValid(title) || !isValid(body)) {
    return res.status(400).send({ status: false, msg: "Please Enter Some data In title Or body" })
  }
  // if (!ObjectId(authorId)) {
  //   return res.status(400).send({ status: false, msg: "Please Provide Valid authorId" })
  // }
  if (!isValid(authorId)) {
    return res.status(400).send({ status: false, msg: "Please Provide Valid authorId" })
  }
  if (!isValidreqbody(tags)) {
    return res.status(400).send({ status: false, msg: "Please Provide tags to the blog" })
  }
  if (!isValid(category)) {
    return res.status(400).send({ satust: false, msg: "Please Provide Categary" })
  }
  if (!isValid(subcategory)) {
    return res.status(400).send({ status: false, msg: "Please provide Subcategary" })
  }

  //   let data = req.body
  //   if (Object.keys(data).length != 0) {
  //     let findAuthor = await authorModel.findById(data.authorId)

  //     if (!data.authorId) {
  //       return res.status(400).send({ msg: "Author_Id is Mandatory" })
  //     }
  //     else if (!findAuthor) {
  //       return res.status(400).send({ msg: "Please enter valid Author Id" })
  //     }

  let savedBlog = await blogModel.create(data)
  res.status(201).send({ msg: savedBlog })

  // }  

  //   else res.status(400).send({ status: false, msg: err.massage })
  // }

  //   catch (err) {
  //     res.status(500).send({ status: false, Error: err.massage })
  //   }
}

// ________________________________GET BLOG_________________________________


const getBlog = async function (req, res) {
  // let data = req.query
  let {...data} = req.query

  if (Object.keys(data).length == 0) {

    let getAllBlogs = await blogModel.find({ isDeleted: false, isPublished: true }).populate('authorId');

    if (getAllBlogs.length == 0) return res.status(404).send({ status: false, msg: "No such blog exist" });
    return res.status(200).send({ status: true, data: getAllBlogs })
  }

  data.isDeleted = false;
  data.isPublished = true;
  let getBlogs = await blogModel.find(data).populate('authorId');

  if (getBlogs.length == 0) return res.status(404).send({ status: false, msg: "No such blog exist" });
  res.status(200).send({ status: true, data: getBlogs })
}


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

    //finding the data is delted or not
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
      let timeStamp = new Date();
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

// ________________________________DELETE BLOG_________________________________

const deleteBlog = async function(req, res){
  try{
    let blogId = req.params.blogId;

    let blog= await blogModel.findById(blogId)
    //check the blog is present or not
    if (!blog){
      return res.status(400).send({status:false, msg: "No such user exists" });
    }

    //check isDeleted satus is true
    if (blog.isDeleted){
      return res.status(400).send({status:false, msg:"Blog is already Delete"});
    }
    //update the status of Isdeleted to true
     let updatedData=await blogModel.findOneAndUpdate({_id: blogId},{isDeleted: true},{new: true})
     return res.status(200).send({status:true, data:updatedData});
  }
 catch (err) {
   res.status(500).send({ status: false, Error: err.massage })
 }
}

// const deletedBlog = async function (req, res) {
// try{
//   let data = req.query

//   const { category, authorId, tags, subcategory, publishedAt } = data
//   if (!isValidreqbody(req.query)) {
//     res.status(400).send({ status: false, msg: "Data Is Not Passes In Query" })
//   }

//   if (!isValid(category)) {
//     res.status(400).send({ status: false, msg: "Please Enter valid Categary" })
//   }
  
//   if (!isValidObjectId(authorId)) {
//     res.status(400).send({ status: false, msg: "Please Enter valid authorID" })
//   }

//   if (!isValid(tags)) {
//     res.status(400).send({ status: false, msg: "Please Enter valid tags" })
//   }

//   if (!isValid(subcategory)) {
//     res.status(400).send({ status: false, msg: "Please Enter valid Subcategary" })
//   }


//   if (!isValid(publishedAt)) {
//     res.status(400).send({ status: false, msg: "Please Enter valid publishedAt" })
//   }

//   let blog = await blogModel.find(data)
//   res.status(201).send({ status: true, Msg: blog })

// }

// catch (err) {
//   res.status(500).send({ status: false, Error: err.message })
// }
// }

// const deletedBlog= async function(req, res){
//   let data = req.query;

//     const { category, authorId, tags, subcategory, publishedAt, ...rest } = data

//     if(rest.length>=0){
//       return res.status(400).send({status:false, msg:"bad request"})
// }
// const isValidObjectId = function (authorId) {  return mongoose.Types.ObjectId.isValid(authorId) }

// let blog = await blogModel.find({authorId:authorId})

// if (blog.length==0){
//   return res.status(404).send({status:false, mag: "No such user exists"});
// }

// let updatedData= await blogModel.updateMany(req.query, { isDeleted:true},{new:true})
// return res.status(200).send({ status:true, data:updatedData})

// }
// const deletedBlog = async function(req, res){
   

//   const { category, authorId, tags, subcategory, publishedAt } = data


//     let blogId = req.query.data
 
//     let blog= await blogModel.findById(blogId)
//     //check the blog is present or not
//     if (!blog){
//       return res.status(400).send({status:false, msg: "No such user exists" });
//     }

//     //check isDeleted satus is true
//     if (blog.isDeleted){
//       return res.status(400).send({status:false, msg:"Blog is already Delete"});
//     }
//     //update the status of Isdeleted to true
//      let updatedData=await blogModel.findOneAndUpdate({_id: blogId},{isDeleted: true},{new: true})
//      return res.status(200).send({status:true, data:updatedData});
//   }

// const deletedBlog= async function(req, res){
//   let data = req.query;

//     const { category, authorId, tags, subcategory, publishedAt, ...rest } = data

//     if(rest.length>=0){ 
//       return res.status(400).send({status:false, msg:"bad request"})
// }

// let updatedData= await blogModel.updateMany(req.query, { isDeleted:true},{new:true})
// return res.status(200).send({ status:true, data:updatedData})

// }

const deletedBlog= async function(req, res){
  let data = req.query;

    const { category, authorId, tags, subcategory, publishedAt, ...rest } = data

    if (!isValidreqbody(req.query)) {
      res.status(400).send({ status: false, msg: "Data Is Not Passes In Query" })
    }

    if (!isValid(category)) {
      res.status(400).send({ status: false, msg: "Please Enter valid Categary" })
    }
    if(!isValidObjectId(authorId)){
      res.send({msg : "invalid author id"})
    }

    // if (!isValidObjectId(authorId)) {
    //   res.status(400).send({ status: false, msg: "Please Enter valid authorID" })
    // }

    if (!isValid(tags)) {
      res.status(400).send({ status: false, msg: "Please Enter valid tags" })
    }

    if (!isValid(subcategory)) {
      res.status(400).send({ status: false, msg: "Please Enter valid Subcategary" })
    }


    if (!isValid(publishedAt)) {
      res.status(400).send({ status: false, msg: "Please Enter valid publishedAt" })
    }

    if(rest.length>=0){
      return res.status(400).send({status:false, msg:"bad request"})
}
const isValidObjectId = function (authorId) {  return mongoose.Types.ObjectId.isValid(authorId) }

let blog = await blogModel.find({authorId:authorId})

if (blog.length==0){
  return res.status(404).send({status:false, mag: "No such user exists"});
}

let updatedData= await blogModel.updateMany(req.query, { isDeleted:true},{new:true})
return res.status(200).send({ status:true, data:updatedData})
}

module.exports.createBlog = createBlog
module.exports.getBlog = getBlog
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
module.exports.deletedBlog = deletedBlog