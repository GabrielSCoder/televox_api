import express from "express"
import { createAsync, deleteAsync, getAllByIdAsync } from "../controllers/notificationController";


const notificationRouter = express.Router();

notificationRouter.post("/", createAsync)
notificationRouter.get("/:id", getAllByIdAsync)
notificationRouter.delete("/:id", deleteAsync)

export default notificationRouter