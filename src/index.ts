import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import { corsConfig, ServerPort } from "./utils/serverConfig";
import mainRouter from "./routes/mainRoute";
import { createServer } from "http";
import socketConfiguration from "./utils/socketConfig";

const app = express();
const server = createServer(app)

app.use(express.json());
app.use(cookieParser())
app.use(cors({...corsConfig}))

socketConfiguration(server)

app.use(mainRouter)

server.listen(ServerPort, () => console.log("Servidor rodando na porta 3003"));
