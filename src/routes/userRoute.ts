import express from "express";
import { postAsync, deleteAsync, getAsync, updateAsync, getUsernameAsync } from "../controllers/userController";
import { authenticate } from "../services/authConfig";

const userRouter = express.Router();

userRouter.post("/", postAsync);   
userRouter.get("/:id", authenticate, getAsync);
userRouter.get("/find/:username", getUsernameAsync);
userRouter.put("/", authenticate, updateAsync);  
userRouter.delete("/:id", authenticate, deleteAsync);

export default userRouter;
