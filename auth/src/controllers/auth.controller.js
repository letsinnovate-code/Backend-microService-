import { compare } from "bcryptjs"
import {User} from "../models/auth.model.js"
import {ApiError} from "../utils/api.error.js"
import {ApiResponse} from "../utils/api.response.js"
import {nanoid} from "nanoid"

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
    const {username,email,password,phone,firstName,lastName,address} = req.body
    
    

    const existingUser = await User.findOne(
        {
            $or:[
                {username},
                {email},
                {phone}
            ]
        }
    )

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
        address,
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
    secure: true,
    
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
    const { _id } = req.user;

  const result = await User.findByIdAndUpdate(
    _id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    },
  );

  //   const options = {
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === "production",
  //   };

  res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(201, "User logout Successfully!"));
    
}

const getUser = async (req,res)=>{
     
   
   try {
     const user = await User.findById(req.user._id)

    console.log(user);

    res.status(200).json({
        success:true,
        user
    })

   } catch (error) {
    throw new ApiError(401,error,"unauthorized access!")
   }
    
    
    
}

const userAddress = async(req,res)=>{

    try {
        const user = await User.findById(req.user._id)
        if(!user){
            throw new ApiError(401,"User not logged in , Please login !")
        }
        res.status(201).json({
        success:true,
        message:"User address found!",
        address:user.address
    })
    } catch (error) {
        
    }
}

export { registerUser,loginUser,logoutUser,getUser,userAddress }