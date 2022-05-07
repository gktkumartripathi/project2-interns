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
    return Object.keys(requestBody).length>0
}


const internCreate = async function (req, res) {

    try {

        let requestBody = req.body

        const { name, mobile, email } = requestBody
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
        // name unique validation

        let nameCheck = await internModel.findOne({ name: requestBody.name })
        if (nameCheck) {
            return res.status(400).send({ status: false, message: "this name already exists" })
        }

        //email req.body validation
        if (!isValid(requestBody.email)) {
            res.status(400).send({ status: false, message: "email is required" })
            return
        }

        //email validations with regex
        const emailPattern = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})/
        if (!email.match(emailPattern)) {
            return res.status(400).send({ status: false, msg: "This is not a valid email" })
        }

        //email unique validation
        let emailCheck = await internModel.findOne({ email: requestBody.email })
        if (emailCheck) {
            return res.status(400).send({ status: false, message: "this email exists" })
        }


        if (!isValid(requestBody.mobile)) {
            res.status(400).send({ status: false, Message: "mobile is required" })
            return
        }

        const mobiles = mobile.replace(/\s+/g, '')
        const mobilePattern = /^(\+91)?0?[6-9]\d{9}$/
        
        if (!mobiles.match(mobilePattern)) {
            return res.status(400).send({ status: false, msg: "This is not a valid Mobile Number" })
        }

        //number unique validation
        let mobileCheck = await internModel.findOne({ mobile: requestBody.mobile })
        if (mobileCheck) {
            return res.status(400).send({ status: false, message: "mobile number already exists" })

        }

        if (!isValid(requestBody.collegeName)) {
            res.status(400).send({ status: false, message: "collegename is required" })
            return
        }

        const collegeId = await collegeModel.findOne({ name: requestBody.collegeName })
        if (!collegeId) {
            return res.status(400).send({ status: false, message: "college not found" })
        }
        if (collegeId.isDeleted === true) {
            return res.status(400).send({ status: false, message: " college is deleted" })
        }

        //creating data intern

        req.body.collegeId = collegeId._id
        const internCreate = await internModel.create(requestBody)
        res.status(201).send({ status: true, data: internCreate, message: "created intern" })

    } catch (error) {

        res.status(500).send({ status: false, message: error.message })
    }

}
module.exports.internCreate = internCreate