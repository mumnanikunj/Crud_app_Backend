import { Project } from "../models/project.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createProject = async (req, res) => {
  try {
    const { title, description, dateTime } = req.body;
    if ([title, description, dateTime].some((field) => !field?.trim())) {
      return res.status(400).json({
        statusCode: 400,
        data: [],
        message: "All fields (title, description, dateTime) are required",
      });
    }
    const existingProject = await Project.findOne({ title });
    if (existingProject) {
      return res.status(400).json({
        statusCode: 400,
        data: [],
        message: "Project with this title already exists",
      });
    }
    const isValidDate = Date.parse(dateTime);
    if (isNaN(isValidDate)) {
      return res.status(400).json({
        statusCode: 400,
        data: [],
        message: "Invalid date and time format",
      });
    }
    // Create project
    const newProject = await Project.create({
      title,
      description,
      dateTime: new Date(dateTime),
    });

    res
      .status(201)
      .json(new ApiResponse(201, newProject, "Project created successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while creating project");
  }
};

const getAllProjects = async (req, res) => {
  try {
    const Allprojects = await Project.find();
    res.status(200).json(new ApiResponse(200, Allprojects, "GetAll projects"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while getting projects");
  }
};

const getProjectById = async (req, res) => {
  try {
    const ProjectById = await Project.findById(req.params.id);
    if (!ProjectById) {
      return res
        .status(400)
        .json(new ApiResponse(400, [], "Project not foundby ID"));
    }
  } catch (error) {
    throw new ApiError(500, "Something went wrong while getting project by id");
  }
};

const UpdateProject = async (req, res) => {
  try {
    const { id, title, description, dateTime } = req.body;
    if ([title, description, dateTime].some((field) => !field?.trim())) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            [],
            "All fields (title, description, dateTime) are required"
          )
        );
    }
    const isValidDate = Date.parse(dateTime);
    if (isNaN(isValidDate)) {
      return res
        .status(400)
        .json(new ApiResponse(400, [], "Invalid date and time format"));
    }
    const existingProject = await Project.findOne({ title, _id: { $ne: id } });
    if (existingProject) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, [], "Project with this title already exists")
        );
    }
    try {
        const updatedProject = await Project.findByIdAndUpdate(
            id,
            {
              title,
              description,
              dateTime: new Date(dateTime),
            },
            { new: true }
          );
          if (!updatedProject) {
            return res.status(404).json(new ApiResponse(404, [], "Project not found in id"));
          }
          res.status(200).json(new ApiResponse(200, updatedProject, "Project updated successfully"));
    } catch (error) {
      return res
        .status(400)
        .json(new ApiResponse(400, [], error));
        
    }
  } catch (error) {
    throw new ApiError(500, "Something went wrong while updating project");
  }
};

const DeleteProject = async (req , res) =>{
    const {id} = req.body
    try {
        const deletedProject = await Project.findByIdAndDelete(id);
        if (!deletedProject) {
          return res.status(404).json(new ApiResponse(404 , [] , "Project not found with Delete ID"));
        }
        res.status(200).json(new ApiResponse(200 , deletedProject , "Project deleted successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500 , error))
    }
}

export { createProject, getAllProjects, getProjectById , UpdateProject ,DeleteProject};
