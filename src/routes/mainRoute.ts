import { Router } from "express";
import authRouter from "./authRoute";

const mainRouter = Router()

mainRouter.use("/auth", authRouter);

export default mainRouter