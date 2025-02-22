import { Router } from "express";
import express from "express"
import { getFollowers, getFollowing, postAsync, verifyAsync, getTotalizers } from "../controllers/followController";

const followRouter = express.Router()

followRouter.post("/", postAsync);
followRouter.post("/verifyUserX", verifyAsync);
followRouter.get("/:id", getFollowing);
followRouter.get("/total/:id", getTotalizers );
followRouter.get("/followers/:id", getFollowers);

export default followRouter