import express from "express";
import { postAsync, deleteAsync, updateAsync, getAsync } from "../controllers/postController";

const postRouter = express.Router();

postRouter.post("/", postAsync);
postRouter.put("/", updateAsync);
postRouter.delete("/:id", deleteAsync);
postRouter.get("/:id", getAsync)

export default postRouter;
