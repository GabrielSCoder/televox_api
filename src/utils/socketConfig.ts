import { Server as HttpServer, Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { corsConfig } from "./serverConfig";
import { followForm } from "../types/followT";
import { follow, getTotalizer, unfollow } from "../db/followDb";
const { Seguidor, Usuario } = require("../models")


export default function socketConfiguration (server : HttpServer) {
    const io = new SocketIOServer(server, {
        cors : {...corsConfig}
    })

    io.on("connection", (socket) => {

        console.log("Usuários conectados: x", Array.from(io.sockets.sockets.keys()));


        socket.on("follow", async (data : followForm) => {
            console.log('testando ------------------------------')
            const resp = await follow(data)
            if (resp) {
                const total = await getTotalizer(data.following_id)
                console.log(total)
                io.emit("followResponse", {total : total, dados : data})
            }
        })

        socket.on("unfollow", async (data : followForm) => {
            const resp = await unfollow(data)
            if (resp) {
                const total = await getTotalizer(data.following_id)
                io.emit("unfollowResponse", {total : total, dados : data})
            }
        })

        socket.on("disconnect", () => {
            console.log("Usuário desconectado: ", socket.id)
            console.log("Usuários conectados: ", io.engine.clientsCount);
            const update = Array.from(io.sockets.sockets.keys())
            console.log("xxxx : \n", update)
        })
    })

    return io
    
}
