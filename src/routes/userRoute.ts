import express from "express";
import { postAsync, deleteAsync, getAsync, updateAsync } from "../controllers/userController";
import { login } from "../controllers/authController";

const userRouter = express.Router();

userRouter.post("/", postAsync);   
userRouter.get("/:id", getAsync); 
userRouter.put("/", updateAsync);  
userRouter.delete("/:id", deleteAsync);
userRouter.post("/auth", login); 

export default userRouter;
