import { compare } from "bcryptjs"
import {User} from "../models/auth.model.js"
import {ApiError} from "../utils/api.error.js"
import {ApiResponse} from "../utils/api.response.js"

const generateTokens = async(userId)=>{
   try {
     const user = await User.findById(userId)

     const refreshToken = user.generateRefreshToken();
     const accessToken = user.generateAccessToken();

     user.refreshToken = refreshToken

     return {refreshToken,accessToken}

   } catch (error) {
    throw new ApiError(401,"Something went wrong while generatiing the tokens!")
   }

}


const registerUser = async (req,res)=>{
    const {username,email,password,phone,firstName,lastName} = req.body
    
    

    const existingUser = await User.findOne({email})

    if(existingUser){
        res.status(401).json({
            success:false,
            message:"User already Exists!"
        })
    }

    const user = await User.create({
        firstName,
        lastName,
        username,
        email,
        password,
        phone,
        isEmailVerified:false,
        
    })

    res.status(201).json({
        success:true,
        user,
        message:"User Created successfully!"
    })




    
    
}

const loginUser = async (req,res)=>{
    const {email,password} = req.body


    try {
        const user = await User.findOne({email}).select("+password")
        console.log(user);
        

        if(!user){
            res.status(401).json({
                success:false,
                message:"invalide Creadentials!"
            })
        }
        const isPasswordValidated = await user.isPasswordCorrect(password)

        
        

        if(!isPasswordValidated){
            res.status(401).json({
                success:false,
                message:"Invalid Creadentials!"
            })
        }

        const {refreshToken,accessToken} = await generateTokens(user._id)

        user.refreshToken = refreshToken;

        await user.save({validateBeforeSave:false})
        const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry",
  );
  // send status of successs

  const options = {
    httpOnly: true,
    secure: true
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options) // set the access token in the cookie
    .cookie("refreshToken", refreshToken, options) // set the refresh token in the cookie
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken }, // send access and refresh token in response if client decides to save them by themselves
        "User logged in successfully",
      ),
    );




    } catch (error) {
        console.log(error);
        
    
        throw new ApiError(401,"Invalid Creadentials !",[error])
        
        
    }

    
}

const logoutUser = async (req,res)=>{
    
}

const getUser = async (req,res)=>{
    const {decodedToken} = req.user
   
    const user = await User.findById(decodedToken._id)

    console.log(user);

    res.status(200).json({
        success:true,
        user
    })

    
    
    
}

export { registerUser,loginUser,logoutUser,getUser }