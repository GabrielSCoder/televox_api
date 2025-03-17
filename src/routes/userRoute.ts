import express from "express";
import { postAsync, deleteAsync, getAsync, updateAsync, getUsernameAsync, verifyEmailAsync, verifyUsernameAsync, verifyPassword, getUsersByFilterAsync } from "../controllers/userController";
import { authenticate } from "../controllers/authController";

const userRouter = express.Router();

userRouter.put("/", authenticate, updateAsync);  
userRouter.get("/:id", authenticate, getAsync);
userRouter.delete("/:id", authenticate, deleteAsync);
userRouter.post("/verify/email",  verifyEmailAsync);

userRouter.post("/", authenticate, postAsync);   
userRouter.post("/verify/password", verifyPassword);
userRouter.get("/find/:username", authenticate, getUsernameAsync);
userRouter.post("/verify/username", authenticate, verifyUsernameAsync);
userRouter.post("/getByfilter", authenticate, getUsersByFilterAsync);

export default userRouter;
