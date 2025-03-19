import { login, meetAsync } from "../controllers/authController";
import express from "express"

const authRouter = express.Router()

authRouter.get("/login", login);   
authRouter.get("/meet", meetAsync);


export default authRouter



