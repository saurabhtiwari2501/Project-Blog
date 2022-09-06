const authorModel = require("../models/authorModel")



const isValidreqbody = function (body) {
    return Object.keys(body).length > 0
}

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}


const authors = async function (req, res) {
    let authorsData = req.body


    if (!isValidreqbody(authorsData)) {
        return res.status(400).send({ status: false, Msg: "please provide auther details" })
    }

    const { fname, lname, title, email, password } = authorsData

    if (!isValid(fname) || !isValid(lname)) {
        return res.status(400).send({ status: false, msg: "fname or lname required" })
    }

    if (!(/^[a-zA-Z\\s]*$/.test(fname))) {
            return res.status(400).send({ status: false, msg: "Please Provide Valid Name" })
        }

// __________________________________TITLE_______________________________________________________

    if (!title) {
        return res.status(400).send({status : false , msg : "title is required"})
    }

    if (!(/^(Mr|Mrs|Miss)\.[A-Za-z]+$/.test(title))) {
        return res.status(400).send({ status : false , msg : "title must be : Mr , Miss , Mrs"})
    }                                     

// ______________________________Email ______________________________________________

    if (!email) {
        return res.status(400).send({ status: false, msg: "PLEASE PROVIDE EMAIL" })
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        return res.status(400).send({ status: false, msg: "PLEASE PROVIDE VALID EMAIL" })
    }

    let uniqueEmail = await authorModel.findOne({ email: email })
    if (uniqueEmail) {
        return res.status(400).send({ status: false, msg: "email address is already resistred" })
    }

    // ___________________________________password regex________________________________

    if (!password) {
        return res.status(400).send({status : false , msg : "please provide password"})
    }

    if(!(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password))){
        return res.status(400).send({status : false , msg : "password must be Minimum eight characters, at least one letter and one number"})
    }

    let authorCreated = await authorModel.create(authorsData)
    res.send({ data: authorCreated })

    

}

module.exports.authors = authors