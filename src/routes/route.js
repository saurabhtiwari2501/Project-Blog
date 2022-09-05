const express = require('express')
const router = express.Router()

const {POSTBlog,GETBlog} = require("../Controllers/blogController")

router.post('/POSTBlog',POSTBlog)
router.get('/GETBlog',GETBlog)


module.exports=router;