import { User } from "../models/auth.model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";


const verifyJWT = async (req, res, next) => {


  const accessToken = req.cookies?.accessToken;
 

  if(!accessToken){
    throw new ApiError(401,"Unauthorized Access!")
  }

  try {
    const decodedToken = await jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)

    if(!decodedToken){
    throw new ApiError(401,"Unauthorized Access!")
  }

  req.user = decodedToken;

  next();

  
  
  } catch (error) {
    throw new ApiError (401,error)
  }
  

}



export {verifyJWT}