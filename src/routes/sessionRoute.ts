import express from "express";
import { deleteAsync, checkAsync } from "../controllers/sessionController";
import { authenticate } from "../controllers/authController";

const sessionRouter = express.Router();

// sessionRouter.post("/", postAsync)
sessionRouter.post("/verify", checkAsync)
sessionRouter.delete("/terminate", deleteAsync)

export default sessionRouter