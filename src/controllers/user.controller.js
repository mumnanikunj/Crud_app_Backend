import { asyncHendler } from "../utils/asyncHendler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
        if([fullname,email,password].some((field) => field?.trim() === '' )){
          return res.status(400)
          .json({statusCode: 400 ,data:[] , message: "All Feild Are Required" })
        }
        const existedUser = await User.findOne({
          $or: [{ email }, { username }],
        });
        if(existedUser){
          res.status(400)
          .json({
            statusCode: 400,
            data: [],
            message: 'User or Email already exists',
          })
        }
        const avatarLocalPath = req.files?.avatar[0]?.path;
        
        if(!avatarLocalPath){
          return res
          .status(400)
          .json({ statusCode: 400, data: [], message: "Avatar file is required" });
        }
        const avatar = await uploadOnCloudinary(avatarLocalPath);
        if (!avatar) {
          throw new ApiError(200, "Avatar file is required");
        }
        const userCreate = await User.create({
          username: username.toLowerCase(),
          email,
          password,
          fullname,
          avatar: avatar.url
        })

        const createdUser = await User.findById(userCreate._id).select("-password -refreshToken");

        if(!createdUser){
          throw new ApiError(400, "User not found");
        }

        return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registed Successfully"));
         
  });


  const loginUser  = asyncHendler(async(req, res) =>{
    const { email, username, password } = req.body;
    if(!(username || email)){
      return res.status(400).json({
        statusCode: 400,
        data: [],
        message: "Username or Email is required",
      })
    }
    console.log('username Or Email', username,email);
    const userFind = await User.findOne({
      $or:[{username}, {email}],
    })
    if(!userFind){
      return res
      .status(401)
      .json({statusCode: 401 , data: [], message: "User not found"})
    }
    const isPasswordvalid = await userFind.isPasswordCorrect(password);
    if(!isPasswordvalid){
      return res
      .status(401)
      .json({statusCode: 401 , data: [], message: "Invalid user credetials"})
    }
    const {accessToken , refreshToken} = await generateAccessAndRefreshToken(userFind._id);

    const loggedInUser = await User.find(userFind._id).select(
      "-password -refreshToken"
    );
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          data: loggedInUser,
          refreshToken,
          accessToken,
        },
        "User Logged in Successfully"
      )
    );
  })

  const logoutUser = asyncHendler(async (req, res) => {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { refreshToken: undefined },
      },
      {
        new: true,
      }
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
  
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        statusCode: 200,
        data: [],
        message: "User Logged out successfully",
      });
  });
  
  const refeshAcceesToken = asyncHendler(async (req, res) => {
    try {
      const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;
      if (!incomingRefreshToken) {
        res
          .status(400)
          .json({ statusCode: 400, data: [], message: "unauthorized requiest" });
      }
  
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
  
      // return
  
      const findUser = await User.findById(decodedToken?._id);
  
      if (!findUser) {
        res
          .status(400)
          .json({ statusCode: 400, data: [], message: "unauthorized User" });
      }
  
      if (incomingRefreshToken != findUser.refreshToken) {
        res.status(400).json({
          statusCode: 400,
          data: [],
          message: "refreshToken is Expired",
        });
      }
  
      const options = {
        httpOnly: true,
        secure: true,
      };
  
      const { accessToken, newrefreshToken } =
        await generateAccessAndRefreshToken(findUser._id);
  
  
      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newrefreshToken, options)
        .json(
          new ApiResponse(
            200,
            {
              accessToken,
              refreshToken: newrefreshToken,
            },
            "Access Token Refreshed Successfully"
          )
        );
    } catch (error) {
      throw new ApiError(400, error.message || "Invalid Token");
    }
  });


  export {
    registerUser,
    loginUser,
    logoutUser,
    refeshAcceesToken,
  }
