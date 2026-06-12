const express=require("express")
const authController=require("../controller/auth.controller")
const authMiddleware=require("../middleware/auth.middleware")
const router=express.Router()

router.post("/register",authController.registerUserController)
router.post("/login",authController.loginUserController)
router.get("/logout",authController.logoutUserController)
router.get("/get-me",authMiddleware.authUser,authController.getMeController)

module.exports=router