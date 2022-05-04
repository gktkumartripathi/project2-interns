const express=require('express')

const router=express.Router()
const collegController=require('../controllers/collegeController')
const internController=require('../controllers/internController')
 router.post('/colleges',collegController.collegeCreate)
 router.post('/interns',internController.internCreate)
 router.get('/collegeDetails' ,collegController.collegeDetails)





 module.exports=router