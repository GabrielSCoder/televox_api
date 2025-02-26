import express from "express";
import { postAsync, deleteAsync, getAsync, updateAsync, getUsernameAsync, verifyEmailAsync, verifyUsernameAsync, verifyPassword } from "../controllers/userController";
import { authenticate } from "../controllers/authController";

const userRouter = express.Router();

userRouter.put("/", authenticate, updateAsync);  
userRouter.get("/:id", authenticate, getAsync);
userRouter.delete("/:id", authenticate, deleteAsync);
userRouter.post("/verify/email", authenticate ,verifyEmailAsync);

userRouter.post("/", postAsync);   
userRouter.post("/verify/password", verifyPassword);
userRouter.get("/find/:username", getUsernameAsync);
userRouter.post("/verify/username", verifyUsernameAsync);

export default userRouter;
