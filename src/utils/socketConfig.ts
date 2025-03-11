import { Server as HttpServer, Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { corsConfig } from "./serverConfig";
import { followForm } from "../types/followT";
import { follow, getTotalizer, unfollow, checkXFollowY } from "../db/followDb";
import { reactPostAsync } from "../controllers/postController";
import { create, getById, getPostReactions, getRepliesByPostId, ReactToPost } from "../db/postDb";
import { postCreateDTO, reactPostForm } from "../types/postT";
const { Seguidor, Usuario } = require("../models")


export default function socketConfiguration(server: HttpServer) {
    const io = new SocketIOServer(server, {
        cors: { ...corsConfig }
    })

    io.on("connection", (socket) => {

        console.log(new Date())
        console.log("Usuários conectados: ", io.engine.clientsCount);


        socket.on("follow", async (data: followForm) => {
            console.log("---------------FOLLOW-----------\n")
            console.log(data)
            const resp = await follow(data)
            if (resp) {
                const relacao = await checkXFollowY({ follower_id: data.follower_id, following_id: data.returnProfileTotalizer && data.profileId ? data.profileId : data.following_id })
                const total = await getTotalizer(data.returnProfileTotalizer && data.profileId ? data.profileId : !data.invertTotalizer ? data.follower_id : data.following_id)
                io.emit("followResponse", { total: total, dados: data, relacao: relacao })
            }
        })

        socket.on("unfollow", async (data: followForm) => {
            console.log("---------------UNFOLLOW-----------\n")
            console.log(data)
            const resp = await unfollow(data)
            if (resp) {
                const relacao = await checkXFollowY({ follower_id: data.follower_id, following_id: data.returnProfileTotalizer && data.profileId ? data.profileId : data.following_id })
                const total = await getTotalizer(data.returnProfileTotalizer && data.profileId ? data.profileId : !data.invertTotalizer ? data.follower_id : data.following_id)
                io.emit("unfollowResponse", { total: total, dados: data, relacao: relacao })
            }
        })

        socket.on("react", async (data: reactPostForm) => {
            console.log("----------PostReact---------")
            console.log(data)
            const resp = await ReactToPost(data)
            if (resp) {
                const total = await getPostReactions(data.post_id)
                if (total) {
                    io.emit("reactResponse", { data: data, liked: resp, total: total })
                }
            }
        })

        socket.on("reply", async (data: postCreateDTO) => {
            console.log("------------Reply--------------\n")

            const resp = await create(data)
            if (resp) {

                const post = await getRepliesByPostId({
                    id: resp.parent_id,
                    profile_id: resp.usuario_id,
                    tamanhoPagina: 0,
                    numeroPagina: 1
                })

                io.emit("replyResponse", post)
            }
        })

        socket.on("disconnect", () => {
            console.log(new Date())
            console.log("XXXXXXXXXXXXXXXXX-Usuário desconectado: ", socket.id)
            console.log("Usuários conectados: ", io.engine.clientsCount);
        })
    })

    return io

}
