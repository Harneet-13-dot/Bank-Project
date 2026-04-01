const userModel=require("../models/user.model")
const jwt=require("jsonwebtoken")
const cookieParser=require("cookie-parser")
const emailService=require('../services/email.service')
const tokenBlackListModel = require("../models/blackList.model")

async function userRegisterController(req,res){
    const { email,password,name}=req.body

    const isExists=await userModel.findOne({
        email: email
    })

    if(isExists){
        return res.status(422).json({
            messsage:"User already exists with this email!",
            status:"failed"
        })
    }

    const user=await userModel.create({
        email,password,name
    })

    const token =jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn :"3d"})

    
    // updated cookies issue
    res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    });

    res.status(201).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name
        },
        token,
        message:"User is registered"
    })

    await emailService.sendRegistrationEmail(user.email,user.name)

}


/**
 * - User Login Controller
 * - POST /api/auth/login 
 */


async function userLoginController(req,res){
    const {email,password}=req.body
    const user=await userModel.findOne({ email }).select("+password")

    if(!user){
        return res.status(401).json({
            message: "email is invalid!"
        })
    }

    const isValidPassword= await user.comparePassword(password)
    
    if(!isValidPassword){
        return res.status(401).json({
            message:"Password is wrong!"
        })
    }

    const token =jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn :"3d"})

    // updated cookies issue
    res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    });

    res.status(200).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name
        },
        token,
        message:"Log in Successful"
    })
}

/**
 * - User Logout Controller
 * - POST /api/auth/logout
  */
async function userLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

    if (!token) {
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }



    await tokenBlackListModel.create({
        token: token
    })

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })

}


const getMe=async (req,res) => {
    try{
        const user=req.user;

        res.status(200).json({
            user:{
                _id:user._id,
                name: user.name,
                email:user.email
            }
        });
    }
    catch(err){
        res.status(500).json({
            message:"failed to fetch user ",
        })
    }
}


module.exports={
    userRegisterController,userLoginController
    ,userLogoutController,getMe
}
