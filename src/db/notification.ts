import { notificaoForm } from "../types/notificacao";

const { Usuario, Notificacao, Post } = require("../models");


export const validate = async (data: notificaoForm) => {

    console.log("-----------validate--------", data)

    if (data.tipo && typeof (data.tipo) == "string") {
       

            const verify = await Usuario.findByPk(data.usuario_id)

            if (!verify) {
                throw new Error("Usuario não existe")
            }

            if (data.post_id) {
                const verifyPost = await Post.findOne({where : {id : data.post_id}, include : [{model : Usuario, as : "usuario", attributes : ["id", "nome", "username"]}]} )

                if (!verifyPost) {
                    throw new Error("Postagem não existe")
                }


            }

            if (data.usuario_destino) {
                const verifyUser = await Usuario.findByPk(data.usuario_destino)

                if (!verifyUser) {
                    throw new Error("Usuario de destino não existe")
                }
            }
      
    } else {
        throw new Error("Tipo de notificação obrigatória")
    }

}

export const createNotification = async (data: notificaoForm) => {

    console.log("Entrando na função", data)

    await validate(data)

    if (data.usuario_id != data.usuario_destino) {

        let verify

        if (data.tipo == "like") {
            verify = await Notificacao.findOne({ where : {tipo : data.tipo, usuario_id : data.usuario_id, usuario_destino : data.usuario_destino, post_id : data.post_id}})
        } else if (data.tipo == "follow") {
            verify = await Notificacao.findOne({ where : {tipo : data.tipo, usuario_id : data.usuario_id, usuario_destino : data.usuario_destino}})
        } else if (data.tipo == "reply") {
            verify = await Notificacao.findOne({ where : {tipo : data.tipo, usuario_id : data.usuario_id, usuario_destino : data.usuario_destino, post_id : data.post_id}})
        }


        if (verify) {

            const umaSemanaEmMs = 7 * 24 * 60 * 60 * 1000; 
            const agora = Date.now();
            const dataCriacao = new Date(verify.data_criacao).getTime();

            
            if (agora - dataCriacao > umaSemanaEmMs) {
                await Notificacao.destroy({ where: { id: verify.id } }); 
            } else {
                return verify; 
            }
        }

        const notify = await Notificacao.create({ ...data, data_criacao: Date.now(), visualizado : false });

        if (!notify) {
            return new Error("Erro interno")
        }

        return notify
    }
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
        }], order : [["data_criacao", "DESC"]]
    })

    return notifications
}

export const confirmNotifications = async (data : {id : number, notifications : Array<number>}) => {

    const verify = await Usuario.findByPk(data.id)

    if (!verify) {
        throw new Error("Usuario não existe")
    }

    const confirm = data.notifications.map((element) => 
        Notificacao.update({visualizado : true}, {where : {id : element}})
    );

    const results = await Promise.all(confirm)

    if (!results) {
        throw new Error("Erro interno")
    }

    return results
  
}