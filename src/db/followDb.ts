import { followForm } from "../types/followT"

const { Seguidor, Usuario } = require("../models")

const validate = async (data: followForm) => {

    if (!data || !data.follower_id || !data.following_id) {
        throw new Error("Dados obrigatórios")
    } else if (data.follower_id === data.following_id) {
        throw new Error("Um usuário não pode seguir ele mesmo")
    }
    const userCheck = await Usuario.findByPk(data.follower_id)

    if (!userCheck) throw new Error("Usuario não encontrado")

    const userTarget = await Usuario.findByPk(data.following_id)
    if (!userTarget) throw new Error("Usuario para seguir não encontrado")

}

export const follow = async (data: followForm) => {

    await validate(data)

    const checkFollow = await Seguidor.findOne({ where: { follower_id: data.follower_id, following_id: data.following_id } })

    if (checkFollow) throw new Error("Usuario já é seguidor")
    const rel = await Seguidor.create({ ...data, followedAt: Date.now() })

    return rel.id
}

export const unfollow = async (data: followForm) => {

    if (!data || !data.follower_id || !data.following_id) {
       return ("Dados obrigatórios")
    }

    const userCheck = await Usuario.findByPk(data.follower_id)

    if (!userCheck) return ("Usuario não encontrado")

    const userTarget = await Usuario.findByPk(data.following_id)
    if (!userTarget) return ("Usuario para deixar de seguir não encontrado")

    const checkFollow = await Seguidor.findOne({ where: { follower_id: data.follower_id, following_id: data.following_id } })

    if (!checkFollow) {
       return ("O usuário não segue ")
    }

    const del = await Seguidor.destroy({ where: { id: checkFollow.id } })

    if (!del) return ("Erro interno")

    return del
}

//todos y que x id segue
export const checkAllfollowing = async (id: number) => {

    const userCheck = await Usuario.findByPk(id)

    if (!userCheck) throw new Error("Usuario não encontrado")

    const check = await Seguidor.findAll({
        where: { follower_id: id },
        include: [{
            model: Usuario,
            as: "usuario",
            attributes: ["nome", "username"]
        }]
    })

    return {followings : check, TotalFollowings : check.length }
}

//todos y que seguem x id
export const checkAllfollowers = async (id: number) => {

    const userCheck = await Usuario.findByPk(id)

    if (!userCheck) throw new Error("Usuario não encontrado")

    const check = await Seguidor.findAll({
        where: { following_id: id },
        include: [{
            model: Usuario,
            as: "usuario",
            attributes: ["nome", "username", "img_url"]
        }]
    })

    return {followers : check, TotalFollowers : check.length }
}


export const checkXFollowY = async (data: followForm) => {
    await validate(data)

    const resp = await Seguidor.findOne({ where: { follower_id: data.follower_id, following_id: data.following_id}})

    if (!resp) return false

    return resp
}

export const getTotalizer = async (id: number) => {
    
    if (!id) {
        throw new Error("id obrigatório")
    }

    const following = await Seguidor.findAll({ where: { follower_id: id}})

    const followers = await Seguidor.findAll({where : {following_id : id}})

    const result = {TotalFollowings : following.length, TotalFollowers : followers.length}

    return result
}