import express from "express"
import { getAsyncMk1, getAsyncMk2 } from "../controllers/feedController";
import { authenticate } from "../controllers/authController";

const feedRouter = express.Router()

feedRouter.post("/mk1", getAsyncMk1);  
feedRouter.post("/mk2", authenticate, getAsyncMk2);  

export default feedRouter