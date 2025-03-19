import { login, checkLogin, logout } from "../controllers/authController";
import express from "express"

const authRouter = express.Router()

authRouter.post("/login", login);   
authRouter.get("/logado", checkLogin);
authRouter.get("/logout", logout)


export default authRouter



