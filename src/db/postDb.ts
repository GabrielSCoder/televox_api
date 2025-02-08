import { where } from "sequelize"
import { postDTO, postForm } from "../types/postT"

const { Post, User } = require("../models")


const validate = async (data: any) => {

    var erros: string[] = []

    if (data.tipo == "") {
        erros.push("Tipo obrigatório")
    }

    if (!data.conteudo || data.conteudo == "") {
        erros.push("Conteudo obrigatório")

    } else {
        const exists = await User.findOne({ where: { id: data.usuario_id } })

        if (!exists) {
            erros.push("Usuario não existe")
        }
    }

    if (erros.length > 0) throw new Error(erros.toString())
}

const convertToDTO = async (data : postForm) => {

    const item : postDTO = {
        id : data.id,
        conteudo : data.conteudo,
        tipo : data.tipo,
        usuario_id : data.usuario_id,
        reacao_gostei : data.reacao_gostei,
        reacao_nao_gostei : data.reacao_nao_gostei,
        qtd_comentarios : data.qtd_comentarios,
        data_criacao : data.data_criacao,
        data_modificacao : data.data_modificacao,
        qt_compartilhamentos : data.qt_compartilhamentos
    }

    return item
}

export const getById = async (id : number) => {

    const resp = await Post.findOne({where : {id : id}})

    if (!resp) {
        throw new Error("post não existe")
    }

    return await convertToDTO(resp)
}

export const create = async (data: { tipo: string, conteudo: string, usuario_id: number }) => {

    await validate(data)

    const post = await Post.create({ ...data, data_criacao: Date.now() });

    return post
}

export const deletePost = async (id: number) => {
    const resp = await Post.findOne({ where: { id: id } })

    if (resp) {
        const r = await Post.destroy({ where: { id: id } })
        return r
    }
}

export const editPost = async (data : {id : number}) => {
    await validate(data)
    await getById(data.id)

    const r = await Post.update(
        {...data, data_modificacao : Date.now()},{where : {id : data.id}}
    )

    return r
}