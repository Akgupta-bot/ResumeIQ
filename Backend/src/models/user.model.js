const mongoose = require("mongoose")

const userSchema=new mongoose.Schema({
 username:{
    type:String,
    required:true,
    unique:[true,"Username already exists"]
 },
 password:{
    type:String,
    required:true
 },
 email:{
    type:String,
    required:true,
    unique:[true,"Account already exits with this email address"]

 }
})

const userModel=mongoose.model("user",userSchema)
module.exports=userModel