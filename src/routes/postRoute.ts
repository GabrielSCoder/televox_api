import express from "express";
import { postAsync, deleteAsync, updateAsync, getAsync, getAllByUserAsync, getByFilterAsync, reactPostAsync, getPostReactionsTotal, listWithReactions,getReplies } from "../controllers/postController";
import { authenticate } from "../controllers/authController";

const postRouter = express.Router();

postRouter.post("/get", authenticate, getAsync)
postRouter.post("/reply", authenticate, getReplies)
postRouter.get("/all/:id", authenticate, getAllByUserAsync)
postRouter.post("/reactPost", authenticate, reactPostAsync)
postRouter.post("/filter", authenticate, getByFilterAsync)
postRouter.post("/", authenticate, postAsync);
postRouter.put("/",authenticate,  updateAsync);
postRouter.delete("/:id", authenticate, deleteAsync);
postRouter.get("/reactPost/totalizer/:id", authenticate, getPostReactionsTotal)
postRouter.post("/reactPost/list", authenticate, listWithReactions)

export default postRouter;
