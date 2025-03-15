import express from "express"
import { confirmAsync, createAsync, deleteAsync, getAllByIdAsync } from "../controllers/notificationController";


const notificationRouter = express.Router();

notificationRouter.post("/", createAsync)
notificationRouter.post("/confirm", confirmAsync)
notificationRouter.get("/:id", getAllByIdAsync)
notificationRouter.delete("/:id", deleteAsync)

export default notificationRouter