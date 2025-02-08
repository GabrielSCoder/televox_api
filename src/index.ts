import express from "express";
import userRouter from "./routes/userRoute";
import postRouter from "./routes/postRoute";
import cors from "cors"

const app = express();
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173", // Permite apenas requisições desse endereço
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos HTTP permitidos
    allowedHeaders: ["Content-Type", "Authorization"] // Cabeçalhos permitidos
}));

// Definição de rotas
app.use("/usuario", userRouter);
app.use("/post", postRouter);        // Todas as rotas de usuário começam com "/users"

app.listen(3003, () => console.log("Servidor rodando na porta 3003"));
