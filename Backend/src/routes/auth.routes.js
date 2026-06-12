const express=require("express")
const authController=require("../controller/auth.Controller")
const router=express.Router()

router.post("/register",authController.registerUserController)
router.post("/login",authController.loginUserController)
router.get("/logout",authController.logoutUserController)
router.get("/get-me")

module.exports=router