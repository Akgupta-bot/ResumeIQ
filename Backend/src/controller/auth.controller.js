const userModel=require("../models/user.model")
const tokenBlacklistModel=require("../models/blacklist.model")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
async function registerUserController(req,res){
  const {username,password,email}=req.body

  if(!username||!password||!email){
    return res.status(400).json({
        message:"please proovide username, email and password"
    })
  }
  const isUserAlreadyExists = await userModel.findOne({
    $or:[{username},{email}]
  })
  if(isUserAlreadyExists){
    return res.status(400).json({
        message:"Account is already exists eith this email or username"
    })
  }

  const hash=await bcrypt.hash(password,10)

  const user=await userModel.create({
    username,
    password:hash,
    email
  
  })

  const token=jwt.sign(
    {id:user._id,username:user.username},
    process.env.JWT_SECRET,
    {expiresIn:"1d"}
  )
  res.cookie("token",token,)
  res.status(201).json({
    message:"User registered successfully",
    user:{
      id:user._id,
      username:user.username,
      email:user.email
    }
  })
}

async function loginUserController(req,res){
  const {email,password}=req.body
  const user=await userModel.findOne({
    email
})
  if(!user){
    return res.status(400).json({
      message:"Invalid email or password"
    })
  }
  const isPasswordValid=await bcrypt.compare(password,user.password)
  if(!isPasswordValid){
    return res.status(400).json({
      message:"Invalid email or password"
    
    })
}
const token=jwt.sign(
    {id:user._id,username:user.username},
    process.env.JWT_SECRET,
    {expiresIn:"1d"}
  )
  res.cookie("token",token,)
  res.status(201).json({
    message:"User login successfully",
    user:{
      id:user._id,
      username:user.username,
      email:user.email
    }
  })

}

async function logoutUserController(req,res){
  const token=req.cookies.token

  if(token){
    await tokenBlacklistModel.create({token})
  }

  res.clearCookie("token")
res.status(200).json({
  message:"User logged out successfully"
})
}
module.exports={
  registerUserController,
  loginUserController,
  logoutUserController

}