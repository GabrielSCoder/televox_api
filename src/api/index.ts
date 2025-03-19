import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import { corsConfig } from "../utils/serverConfig";
import mainRouter from "../routes/mainRoute";
import { createServer } from "http";
import socketConfiguration from "../utils/socketConfig";
import { VercelRequest, VercelResponse } from '@vercel/node';

const app = express();
const server = createServer(app)

app.use(express.json());
app.use(cookieParser())
app.use(cors({...corsConfig}))

socketConfiguration(server)

app.use(mainRouter)

app.listen(8080, () => console.log("Server ready on port 3000."));

module.exports = app;