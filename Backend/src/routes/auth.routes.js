const express=require("express")
const authController=require("../controllers/auth.controller")
const { authMiddleware } = require("../middleware/auth.middleware")

const router = express.Router()

router.post("/register",authController.userRegisterController)

router.post("/login",authController.userLoginController)

// getting user name and logo on dashboard
router.get("/me",authMiddleware,authController.getMe)


router.post("/logout", authController.userLogoutController)

module.exports=router