import express from "express"
import { getFollowers, getFollowing, postAsync, verifyAsync, getTotalizers, getFollowingCompare, getFollowerCompare } from "../controllers/followController";
import { authenticate } from "../controllers/authController";

const followRouter = express.Router()

followRouter.post("/", authenticate, postAsync);
followRouter.post("/verifyUserX", authenticate, verifyAsync);
followRouter.get("/following/:id", getFollowing);
followRouter.post("/compare/following", getFollowingCompare);
followRouter.post("/compare/followers", getFollowerCompare);
followRouter.get("/total/:id", getTotalizers );
followRouter.get("/followers/:id", getFollowers);

export default followRouter