import { Router } from "express";
import {createProject, getAllProjects, getProjectById , UpdateProject ,DeleteProject} from "../controllers/project.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/createProject').post(verifyJWT,createProject);
router.route('/getAllProjects').get(getAllProjects);
router.route('/getProjectById').get(verifyJWT,getProjectById);
router.route('/updateProject').put(verifyJWT,UpdateProject);
router.route('/deleteProject').delete(verifyJWT,DeleteProject);


export default router;