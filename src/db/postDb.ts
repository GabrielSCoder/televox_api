import { Sequelize, where } from "sequelize"
import { feedFilterDTO, postDTO, postFilterDTO, postForm, postListDTO, reactPostForm, responsePostFilterDTO } from "../types/postT"
import { error } from "console"

const { Post, Usuario, PostReaction } = require("../models")


const validate = async (data: any) => {

    var erros: string[] = []

    if (data.tipo == "") {
        erros.push("Tipo obrigatório")
    }

    if (!data.conteudo || data.conteudo == "") {
        erros.push("Conteudo obrigatório")

    } else {
        const exists = await Usuario.findOne({ where: { id: data.usuario_id } })

        if (!exists) {
            erros.push("Usuario não existe")
        }
    }

    if (erros.length > 0) throw new Error(erros.toString())
}

const convertToDTO = async (data: postForm) => {

    const item: postDTO = {
        id: data.id,
        conteudo: data.conteudo,
        tipo: data.tipo,
        usuario_id: data.usuario_id,
        data_criacao: data.data_criacao,
        data_modificacao: data.data_modificacao
    }

    return item
}

export const getById = async (id: number) => {

    const resp = await Post.findOne({ where: { id: id } })

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

export const editPost = async (data: { id: number }) => {
    await validate(data)
    await getById(data.id)

    const r = await Post.update(
        { ...data, data_modificacao: Date.now() }, { where: { id: data.id } }
    )

    return r
}

export const getAllPostByIdUser = async (id: number) => {
    const resp = await Post.findAll({ where: { usuario_id: id } })

    if (resp.length > 0) {
        const pageItem: postListDTO = {
            quantidade_postagens: resp.length,
            listaPostagens: resp
        }

        return pageItem
    }

    throw new Error("Error interno")
}

export const getAllPostByUsername = async (id: number) => {

    const resp = await Post.findAll({ where: { usuario_id: id } })

    if (resp.length > 0) {
        const pageItem: postListDTO = {
            quantidade_postagens: resp.length,
            listaPostagens: resp
        }
        return pageItem
    }

    throw new Error("Error interno")
}

export const getPostsByFilter = async (filter: postFilterDTO) => {

    var resp
    var list

    if (filter.usuario && typeof (filter.usuario) == "string") {
        const user = await Usuario.findOne({ where: { username: filter.usuario } })
        console.log(filter.usuario)
        if (user) {
            resp = await Post.findAll({
                where: { usuario_id: user.id },
                include: [{
                    model: Usuario,
                    as: "usuario",
                    attributes: ["nome", "username", "img_url", "data_criacao"]
                }]
            })
        } else {
            throw new Error("Usuario não encontrado")
        }
    } else if (filter.usuario && typeof (filter.usuario) == "number") {
        resp = await Post.findAll({ where: { usuario_id: filter.usuario } })
    } else {
        throw new Error("informação de usuario obrigatória")
    }

    const nSegments = Math.ceil(resp.length / filter.tamanhoPagina)

    if (nSegments != filter.numeroPagina) {
        const primeiraPos = (filter.numeroPagina - 1) * filter.tamanhoPagina
        const ultimaPos = primeiraPos + filter.tamanhoPagina
        list = resp.slice(primeiraPos, ultimaPos)
    } else if (nSegments == filter.numeroPagina) {
        const primeiraPos = (filter.numeroPagina - 1) * filter.tamanhoPagina
        list = resp.slice(primeiraPos)
    }

    const item: responsePostFilterDTO = {
        quantidade_postagens: resp.length,
        pagina: filter.numeroPagina,
        numeroPaginas: nSegments,
        listaPostagens: list
    }

    return item
}


export const ReactToPost = async (data: reactPostForm) => {


    if (data && data.post_id && data.usuario_id) {

        console.log("aqui")

        const checkPost = await Post.findByPk(data.post_id)
        const checkUser = await Usuario.findByPk(data.usuario_id)

        if (checkPost && checkUser) {
            const checkReact = await PostReaction.findOne({ where: { post_id: data.post_id, usuario_id: data.usuario_id } })

            if (!checkReact) {
                const create = await PostReaction.create({ ...data, data_criacao: Date.now() })

                if (create) return {liked : true}

                throw new Error("erro interno")

            } else {

                const destroy = await PostReaction.destroy({ where: { id: checkReact.id } })

                if (destroy) return {liked : false}

                throw new Error("erro interno")
            }

        } else {
            throw new Error("Erro na busca do usuário ou da postagem")
        }
    } else {
        throw new Error("Dados obrigatórios")
    }
}

export const getPostReactions = async (id: number) => {
    const reactions = await PostReaction.findOne({
        where: { post_id: id },
        attributes: [
            [Sequelize.fn('COUNT', Sequelize.col('post_id')), 'total_reactions']
        ]
    })
    return reactions
}

export const getUserPostsWithReactions = async (data: { authorId: number, userId: number }) => {


    if (data.authorId && data.userId) {
        const posts = await Post.findAll({
            where: { usuario_id: data.authorId },
            attributes: [
                'id',
                'conteudo',
                'data_criacao',
                'data_modificao',
                [
                    Sequelize.literal(`
                        (SELECT COUNT(*) FROM post_reaction WHERE post_reaction.post_id = "Post".id)
                    `),
                    'total_reactions'
                ],
                [
                    Sequelize.literal(`
                        EXISTS (
                            SELECT 1 FROM post_reaction 
                            WHERE post_reaction.post_id = "Post".id 
                            AND post_reaction.usuario_id = ${data.userId}
                        )
                    `),
                    'liked'
                ]
            ],
            include: [
                {
                    model: Usuario,
                    as: 'usuario',
                    attributes: ['id', 'username', 'img_url']
                }
            ],
            order: [['data_criacao', 'DESC']]
        });

        return {
            quantidade_postagens: posts.length,
            listaPostagens: posts
        };
    } else {
        throw new Error("Dados obrigatórios")
    }

};


export const feedMk1 = async (filter: feedFilterDTO) => {
    var resp
    var list = []



    if (filter.id && filter.tamanhoPagina) {
        const user = await Usuario.findByPk(filter.id)
        if (!user) {
            throw new Error("Usuario não encontrado")
        }

        const posts = await Post.findAll({
            include: [
                {
                    model: Usuario,
                    as: "usuario",
                    attributes: ["nome", "username", "img_url", "data_criacao"]
                }
            ]
        })

        const newRandN = () => Math.floor(Math.random() * posts.length)

        var previosRand: number[] = []

        for (let i = 0; i < filter.tamanhoPagina; i++) {

            var n = newRandN()

            while (previosRand.includes(n)) {
                n = newRandN()
            }

            list.push(posts[n])
            previosRand.push(n)
        }

        return list

    }

    throw new Error("informação de usuario obrigatória")
}