import express from "express";
import userRouter from "./routes/userRoute";
import postRouter from "./routes/postRoute";
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "./routes/authRoute";

const app = express();

app.use(express.json());
app.use(cookieParser())

app.use(cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials : true
}));

app.use("/auth", authRouter);
app.use("/usuario", userRouter);
app.use("/post", postRouter);      

app.listen(3003, () => console.log("Servidor rodando na porta 3003"));
