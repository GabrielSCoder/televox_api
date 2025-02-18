import express from "express";
import { postAsync, deleteAsync, getAsync, updateAsync, getUsernameAsync, verifyEmailAsync, verifyUsernameAsync, verifyPassword } from "../controllers/userController";
import { authenticate } from "../controllers/authController";

const userRouter = express.Router();

userRouter.post("/", postAsync);   
userRouter.get("/:id", authenticate, getAsync);
userRouter.get("/find/:username", getUsernameAsync);
userRouter.post("/verify/email", verifyEmailAsync);
userRouter.post("/verify/username", verifyUsernameAsync);
userRouter.post("/verify/password", verifyPassword);
userRouter.put("/", authenticate, updateAsync);  
userRouter.delete("/:id", authenticate, deleteAsync);

export default userRouter;
