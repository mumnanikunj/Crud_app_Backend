import { Router } from "express";
import {createProject, getAllProjects, getProjectById , UpdateProject ,DeleteProject} from "../controllers/project.controller.js";

const router = Router();

router.route('/createProject').post(createProject);
router.route('/getAllProjects').get(getAllProjects);
router.route('/getProjectById').get(getProjectById);
router.route('/updateProject').put(UpdateProject);
router.route('/deleteProject').delete(DeleteProject);


export default router;