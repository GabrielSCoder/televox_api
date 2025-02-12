import { login, login2, checkLogin, logout } from "../controllers/authController";
import { refreshToken } from "../services/authConfig";
import express from "express"

const authRouter = express.Router()

authRouter.post("/login", login2);  
authRouter.get("/refresh", refreshToken);  
authRouter.get("/logado", checkLogin);
authRouter.get("/logout", logout)


export default authRouter



