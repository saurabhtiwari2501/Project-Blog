const { modelName } = require("../models/authorModel")


// _____________________________POST BLOG__________________________


const POSTBlog = async function (req,res) {

  try { 
    let data = req.body
    let savedBlog = await modelName.create(data)
    res.status(201).send({msg : savedBlog})
}
catch(err){
    res.status(500).send(err.massage)
}
}

// ________________________________GET BLOG_________________________________


const GETBlog = async function (req,res) {
    
   try{
     let data = await modelName.find()
    res.status(201).send({msg : data}) 
}
catch(err){
    res.status(500).send(err.massage)
}
}


module.expost= {POSTBlog,GETBlog}