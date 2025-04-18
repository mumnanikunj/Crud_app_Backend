import { User } from "../models/user.model.js";
import { asyncHendler } from "../utils/asyncHendler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHendler(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers["authorization"];
    const token = req.cookies?.accessToken || (authHeader && authHeader.replace("Bearer ", ""));

    if (!token) {
      return res.status(401).json({ statusCode: 401, data: [], message: "Unauthorized request" });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      return res.status(401).json({ statusCode: 401, data: [], message: "Invalid user" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Invalid token", error);
    return res.status(403).json({ statusCode: 403, data: [], message: "Invalid token" });
  }
});
