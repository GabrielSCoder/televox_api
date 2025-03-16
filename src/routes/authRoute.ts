import { login2, checkLogin, logout} from "../controllers/authController";
import express from "express"

const authRouter = express.Router()

authRouter.post("/login", login2);   
authRouter.get("/logado", checkLogin);
authRouter.get("/logout", logout)


export default authRouter



