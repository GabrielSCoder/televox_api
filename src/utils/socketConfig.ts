import { Server as HttpServer, Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { corsConfig } from "./serverConfig";

export default function socketConfiguration(server: HttpServer) {
    const io = new SocketIOServer(server, {
        cors: { ...corsConfig }
    })

    io.on("connection", (socket) => {

        socket.on("connect", () => {
            console.log("usuario conectado")
        })

        socket.on("disconnect", () => {
            console.log(new Date())
            console.log("XXXXXXXXXXXXXXXXX-Usuário desconectado: ", socket.id)
            console.log("Usuários conectados: ", io.engine.clientsCount);
        })
    })

    return io

}
