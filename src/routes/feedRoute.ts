import express from "express"
import { getAsyncMk1 } from "../controllers/feedController";
import { authenticate } from "../controllers/authController";

const feedRouter = express.Router()

feedRouter.post("/mk1", authenticate, getAsyncMk1);  

export default feedRouter