import { User } from "../models/auth.model.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api.error.js";
import { ApiResponse } from "../utils/api.response.js";

const verifyJWT = async (req, res, next) => {
  const token = req.cookies?.accessToken;
  

  if (!token) {
    throw new ApiError(401, "User not LoggedIn,Please login !");
  }

  try {

    const decodedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
    );
    console.log(decodedToken);
    
    if (!decodedToken) {
      throw new ApiError(401, "Unauthorized Access, Please login!");
    }
    req.user = decodedToken;
    next();
  } catch (error) {
    throw new ApiError(error);
  }
};

export { verifyJWT };
