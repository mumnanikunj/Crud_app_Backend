import { Router } from "express";
import { loginUser, logoutUser, refeshAcceesToken, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();


router.route("/register").post(
    upload.fields([
      { name: "avatar", maxCount: 1 },
    ]),
    registerUser
  );
  
  router.route("/login").post(loginUser);
  
  //secured routes
  
  router.route("/logout").post(verifyJWT, logoutUser);
  
  router.route("/refresh-token").post(refeshAcceesToken);


export default router