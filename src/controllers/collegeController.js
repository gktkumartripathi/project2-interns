const collegeModel=require('../models/collegeModel')
const internModel=require('../models/internModel')

//globally we are validating functions  user entry

const isValid=function(value){

    if(typeof value==='undefined'|| value===null)
    return false
    if(typeof value==='string'&&value.trim().length===0)
    return false
    if(typeof value==='number')
    return false
    return true
} 

//here we are validating request body

const isValidRequestBody=function(requestBody){
    return Object.keys(requestBody.length>0)
}


//post api for college 
const collegeCreate=async function(req,res){

try{
 // performing major validation

 const requestBody=req.body
 if(!isValidRequestBody(requestBody)){
     res.status(400).send({status:false,message:"invalid request parametere,provide college details"})
     return
 }
 if(!isValid(requestBody.name)){
     res.status(400).send({status:false,message:"college name is required"})
     return
 }
if(!isValid(requestBody.fullName)){
    res.status(400).send({status:false,message:"full name is required"})
    return
}
if(!isValid(requestBody.logoLink)){

    res.status(400).send({status:false,message:"logoLink is required"})
    return 
}


let uniqueNameCheck=await collegeModel.findOne({name:requestBody.name})
if(uniqueNameCheck){
    return res.status(400).send({status:false,message:"this name already exist"})
}

let uniqueFullNameCheck=await collegeModel.findOne({fullName:requestBody.fullName})
if(uniqueFullNameCheck){
    return res.status(400).send({status:false,message:"this full name already exist"})
}
//validation ends

let collegeCreate=await collegeModel.create(requestBody)
res.status(201).send({status:true,data:collegeCreate,message:"college created successfully"})


}catch(error){
    res.status(500).send({status:false,message:error.message})
}

}












module.exports.collegeCreate=collegeCreate