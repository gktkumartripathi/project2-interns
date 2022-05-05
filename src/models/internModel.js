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
//   match:  [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']

},
mobile:{

    type:String,
    unique:true,
    required:true, 
    // match:  /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/g




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
