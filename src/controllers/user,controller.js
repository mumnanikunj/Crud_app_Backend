import { asyncHendler } from "../utils/asyncHendler.js";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.model";


const generateAccessAndRefreshToken = async (userId) => {
    try {
      const user = await User.findById(userId);
      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();
  
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
  
      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiError(
        500,
        "Something went wrong while generate refesh token and access token"
      );
    }
  };



  const registerUser = asyncHendler(async (req, res) => {
        const {username , email , password , fullname} = req.body;
        if([fullname,email,password].some((field) => field?.trim() === '' ))
  });