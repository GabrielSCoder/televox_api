import { login, login2, checkLogin } from "../controllers/authController";
import { refreshToken } from "../services/authConfig";
import express from "express"

const authRouter = express.Router()

authRouter.post("/login", login2);  
authRouter.get("/refresh", refreshToken);  
authRouter.get("/logado", checkLogin);


export default authRouter



