const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")

// _____________________________POST BLOG__________________________


<<<<<<< HEAD
const POSTBlog = async function (req, res) {

  try {
    let data = req.body
    let savedBlog = await modelName.create(data)
    res.status(201).send({ msg: savedBlog })
  }
  catch (err) {
    res.status(500).send(err.massage)
=======
const createBlog = async function (req, res) {

  try {
    let data = req.body
    let findAuthor = await authorModel.findById(data.authorId)

    if (!data.authorId) {
      return res.status(400).send({ msg: "Author_Id is Mandatory" })
    }
    else if (!findAuthor) {
      return res.status(400).send({ msg: "Please enter valid Author Id" })
    }

    let savedBlog = await blogModel.create(data)
    res.status(201).send({ msg: savedBlog })

  }
  catch (err) {
    res.status(500).send({ status: false, Error: err.massage })
>>>>>>> 7a768f48fb020c73865a40128598feb989ad80dd
  }
}

// ________________________________GET BLOG_________________________________


const GETBlog = async function (req, res) {

  try {
<<<<<<< HEAD
    let data = await modelName.find()
    res.status(201).send({ msg: data })
  }
  catch (err) {
    res.status(500).send(err.massage)
=======
    let data = await blogModel.find()
    res.status(201).send({ msg: data })
  }
  catch (err) {
    res.status(500).send({ status: false, Error: err.massage })
>>>>>>> 7a768f48fb020c73865a40128598feb989ad80dd
  }
}

const getBlogsWithAuthorDetails = async function (req, res) {
  let specificBook = await bookModel.find().populate('authorId')
  res.send({ data: specificBook })

<<<<<<< HEAD
module.expost = { POSTBlog, GETBlog }
=======
}

module.exports.createBlog = createBlog
>>>>>>> 7a768f48fb020c73865a40128598feb989ad80dd
