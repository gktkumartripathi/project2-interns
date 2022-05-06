const collegeModel = require('../models/collegeModel')
const internModel = require('../models/internModel')
const validUrl = require('valid-url')

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


//post api for college 
const collegeCreate = async function (req, res) {

    try {
        // performing major validation

        const requestBody = req.body

        const { name, fullName, logoLink } = requestBody

        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: "invalid request parametere,provide college details" })
            return
        }
        if (!isValid(requestBody.name)) {
            res.status(400).send({ status: false, message: "college name is required" })
            return
        }

        const namePattern = /^[a-z]((?![? .,'-]$)[ .]?[a-z]){1,10}$/gi

        if (!name.match(namePattern)) {
            return res.status(400).send({ status: false, msg: "This is not a valid Name" })
        }
        if (!isValid(requestBody.fullName)) {
            res.status(400).send({ status: false, message: "full name is required" })
            return
        }

        const fullNamePattern = /^[a-z]((?![? .,'-]$)[ .]?[a-z,]){3,150}$/gi

        if (!fullName.match(fullNamePattern)) {
            return res.status(400).send({ status: false, msg: "This is not a valid full Name" })
        }

        if (!isValid(requestBody.logoLink)) {

            res.status(400).send({ status: false, message: "logoLink is required" })
            return
        }

        // Url type validation

        if (!validUrl.isUri(logoLink)) {
            return res.status(400).send({ status: false, msg: 'logoLink is not a valid url type' })

        }

        let uniqueNameCheck = await collegeModel.findOne({ name: requestBody.name })
        if (uniqueNameCheck) {
            return res.status(400).send({ status: false, message: "this name already exist" })
        }

        let uniqueFullNameCheck = await collegeModel.findOne({ fullName: requestBody.fullName })
        if (uniqueFullNameCheck) {
            return res.status(400).send({ status: false, message: "this full name already exist" })
        }

        let uniqueLogoLinkUrl = await collegeModel.findOne({ logoLink: requestBody.logoLink })
        if (uniqueLogoLinkUrl) {
            return res.status(400).send({ status: false, message: "this logoLink Url already exist" })
        }

        //validation ends

        let collegeCreate = await collegeModel.create(requestBody)
        res.status(201).send({ status: true, data: collegeCreate, message: "college created successfully" })


    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}


const collegeDetails = async function (req, res) {
    try {
        const collegeName = req.query.collegeName;
        if (!collegeName)

            return res.status(400).send({ status: false, msg: 'please provide collegeName in the query' })

        const collegeNames = await collegeModel.findOne({ name: collegeName, isDeleted: false })
        if (!collegeNames) {
            return res.status(404).send({ status: false, message: "no college available with this name" })
        }

        const { name, fullName, logoLink } = collegeNames

        const collegeId = collegeNames._id

        const internDetails = await internModel.find({ collegeId: collegeId, isDeleted: false }).select
            ({ "_id": 1, "name": 1, "email": 1, "mobile": 1 })


        const data = { name: name, fullName: fullName, logoLink: logoLink, interns: internDetails }
        return res.status(200).send({ status: true, data: data })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}


module.exports.collegeCreate = collegeCreate
module.exports.collegeDetails = collegeDetails