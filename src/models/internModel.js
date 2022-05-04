const mongoose=require('mongoose')

const internSchema=new mongoose.Schema({

name:{

    type:String,
    required:true,
    trim:true
},
email:{
    type:String,
    required:true,
    lowercase:true,
    unique:true,
  match:  [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']

},
mobile:{

    type:String,
    unique:true,
    required:true,
    // match:/^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}/ 
  match:  /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/



},
collegeId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'College',
    required:true
},
isDeleted:{
    type:Boolean,
    default:false
}



},{timestamps:true})
module.exports=mongoose.model('intern',internSchema)
