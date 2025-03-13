import { notificaoForm } from "../types/notificacao";

const { Usuario, Notificacao, Post } = require("../models");


export const validate = async (data: notificaoForm) => {

    if (data.tipo && typeof (data.tipo) == "string") {
        if (data.usuario_id) {

            const verify = await Usuario.findByPk(data.usuario_id)

            if (!verify) {
                throw new Error("Usuario não existe")
            }

            if (data.post_id) {
                const verifyPost = await Post.findOne({where : {id : data.post_id}, include : [{model : Usuario, as : "usuario", attributes : ["id", "nome", "username"]}]} )

                if (!verifyPost) {
                    throw new Error("Postagem não existe")
                }

                if (verifyPost.usuario.id != data.usuario_destino) {
                    throw new Error("Essa postagem não foi feita pelo usuario de destino informado")
                }

            }

            if (data.usuario_destino) {
                const verifyUser = await Usuario.findByPk(data.usuario_destino)

                if (!verifyUser) {
                    throw new Error("Usuario de destino não existe")
                }
            }
        } else {
            throw new Error("Usuário obrigatório")
        }
    } else {
        throw new Error("Tipo de notificação obrigatória")
    }

}

export const create = async (data: notificaoForm) => {

    await validate(data)

    const notify = await Notificacao.create({ ...data, data_criacao: Date.now() });

    return notify
}

export const destroy = async (id: number) => {

    const verify = await Notificacao.findByPk(id)

    if (!verify) {
        return "Notificação não existe"
    }

    const notify = await Notificacao.destroy(id)

    return notify
}

export const getNotificationsByUserId = async (id: number) => {
    const verify = await Usuario.findByPk(id)

    if (!verify) {
        throw new Error("Usuario não existe")
    }

    const notifications = await Notificacao.findAll({
        where: { usuario_destino: id }, include: [{
            model: Usuario,
            as: "usuario",
            attributes: ["id", "nome", "username", "img_url"]
        }]
    })

    return notifications
}