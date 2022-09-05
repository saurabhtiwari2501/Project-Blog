const authorModel=require("../models/authorModel")

const authors=async function(req, res){
    let authorsData= req.body
            let authorCreated = await authorModel.create(authorsData)
            res.send({data:authorCreated})
    
}


module.exports.authors=authors