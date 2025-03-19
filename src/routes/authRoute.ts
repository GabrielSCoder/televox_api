import { login, checkLogin, logout, meetAsync } from "../controllers/authController";
import express from "express"

const authRouter = express.Router()

authRouter.post("/login", login);   
authRouter.get("/logado", checkLogin);
authRouter.get("/logout", logout);
authRouter.get("/meet", meetAsync);


export default authRouter



