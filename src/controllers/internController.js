const collegeModel = require('../models/collegeModel')
const internModel = require('../models/internModel')


//globally we are validating functions  user entry

const isValid = function (value) {

    if (typeof value === 'undefined' || value === null)
        return false
    if (typeof value === 'string' && value.trim().length === 0)
        return false
    if (typeof value === 'number')
        return false
    return true
}

//here we are validating request body

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody.length > 0)
}


const internCreate = async function (req, res) {

    try {

        let requestBody = req.body

        const { name } = requestBody
        if (!isValidRequestBody(requestBody)) {

            res.status(400).send({ status: false, Message: "invalid request body provide intern details" })
            return
        }
        if (!isValid(requestBody.name)) {
            res.status(400).send({ status: false, Message: "name is required" })
            return
        }

        let namePattern = /^[a-z]((?![? .,'-]$)[ .]?[a-z]){3,24}$/gi

        if (!name.match(namePattern)) {
            return res.status(400).send({ status: false, msg: "This is not a valid Name" })
        }

        if (!isValid(requestBody.email)) {
            res.status(400).send({ status: false, Message: "email is required" })
            return
        }
        if (!isValid(requestBody.mobile)) {
            res.status(400).send({ status: false, Message: "mobile is required" })
            return
        }
        if (!isValid(requestBody.collegeName)) {
            res.status(400).send({ status: false, message: "collegename is required" })
            return
        }
        //email unique validation
        if (!isValid(requestBody.email)) {
            res.status(400).send({ status: false, message: "email exists" })
            return
        }
        // number unique
        //    let checkNumber=requestBody.mobile
        //    let chcekNum2=(/^[0-9]{10}/.test(requestBody.mobile))
        //    if(!checkNumber.length===10 && chcekNum2){
        //        return res.status(400).send({status:false,message:"enter valid mobile number"})
        //    }
        //validate college existance
        const collegeId = await collegeModel.findOne({ name: requestBody.collegeName })
        if (!collegeId) {
            return res.status(400).send({ status: false, message: "college not found" })
        }
        if (collegeId.isDeleted === true) {
            return res.status(400).send({ status: false, message: " college is deleted" })
        }
        //email unique validation
        let emailCheck = await internModel.find({ email: requestBody.email })
        if (!emailCheck) {
            return res.status(400).send({ status: false, message: "this email exists" })
        }

        //email format validation 

        // if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test({email:requestBody.email}))){

        //     return res.status(400).send({ status: false, message: 'email should be a valid email address' })
        // }



        //number unique validation
        let mobileCheck = await internModel.find({ mobile: requestBody.mobile })
        if (!mobileCheck) {
            return res.status(400).send({ status: false, message: "mobile number already exists" })

        }
        //creating data intern 
        req.body.collegeId = collegeId._id
        const internCreate = await internModel.create(requestBody)
        res.status(400).send({ status: false, data: internCreate, message: "created intern" })

    } catch (error) {

        res.status(500).send({ status: false, message: error.message })
    }

}
module.exports.internCreate = internCreate