import express from "express";
import { postAsync, deleteAsync, updateAsync, getAsync, getAllByUserAsync, getByFilterAsync } from "../controllers/postController";
import { authenticate } from "../controllers/authController";

const postRouter = express.Router();

postRouter.post("/", authenticate, postAsync);
postRouter.put("/", updateAsync);
postRouter.delete("/:id", deleteAsync);
postRouter.get("/:id", getAsync)
postRouter.get("/all/:id", authenticate, getAllByUserAsync)
postRouter.post("/filter", getByFilterAsync)

export default postRouter;
