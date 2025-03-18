import { postAsync, checkLogin, logout } from "../controllers/authController";
import express from "express"

const authRouter = express.Router()

authRouter.post("/login", postAsync);   
authRouter.get("/logado", checkLogin);
authRouter.get("/logout", logout)


export default authRouter



