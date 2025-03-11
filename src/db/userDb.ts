import { where, Op, Sequelize } from "sequelize";
import { usuarioAnyDTO, usuarioDTO, usuarioFilterDTO, usuarioForm } from "../types/usuarioT";
import { reservedWords } from "../utils/reservedString";

const { Usuario } = require("../models");

const validate = async (data: any) => {

    var erros: string[] = []

    if (!data.nome || data.nome == "") {
        erros.push("Nome vazio")
    }

    if (!data.email || data.email == "") {
        erros.push("Email vazio")

    } else {

        const exists = await Usuario.findOne({ where: { email: data.email } })

        console.log(exists)

        if (exists) {
            erros.push("Email já cadastrado")
        }
    }

    if (!data.username || data.username == "") {

        erros.push("Nome de usuário obrigatório")

    } else {
        const userExists = await Usuario.findOne({ where: { username: data.username } })

        if (userExists) {
            erros.push("Nome de usuário já utilizado")
        }
    }

    if (!data.senha || data.senha == "") {
        erros.push("Senha vazia")
    }

    if (erros.length > 0) throw new Error(erros.toString())
}

const convertToDTO = async (data: usuarioForm) => {

    var item: usuarioDTO = {
        id: data.id,
        nome: data.nome,
        username: data.username,
        email: data.email,
        genero: data.genero,
        texto_bio : data.texto_bio,
        img_url: data.img_url ?? "",
        background_url : data.background_url,
        data_nascimento: data.data_nascimento,
        data_criacao: data.data_criacao,
        data_modificacao: data.data_modificacao
    }

    return item
}

const convertToAnnymoDTO = async (data: usuarioDTO) => {

    var item: usuarioAnyDTO = {
        id: data.id,
        nome: data.nome,
        username: data.username
    }

    return item
}

export const create = async (data: usuarioForm) => {

    await validate(data)

    const user = await Usuario.create({ ...data, data_criacao: Date.now() });

    return user.id
}

export const getById = async (id: any) => {

    const resp = await Usuario.findByPk(id)

    if (!resp) throw new Error("Usuario não encontrado")

    return await convertToDTO(resp)
}

export const getByUsername = async (username: string) => {

    console.log("username", username)

    const resp = await Usuario.findOne({ where: { username: username } })

    if (!resp) throw new Error("Username não encontrado")

    return await convertToDTO(resp)
}

export const verifyEmail = async (email: string) => {

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if (!email || email && typeof (email) != "string") {
        return ({ succes: false, message: "E-mail obrigatório" })
    } else if (email.match(emailPattern) && email.length < 256) {
        const resp = await Usuario.findOne({ where: { email: email } })
        if (resp) {
            return ({ succes: false, message: "E-mail já cadastrado" })
        }
    } else {
        return ({ succes: false, message: "Padrão incorreto de email" })
    }

    return { succes: true, message: "Correto e disponivel" }
}

export const verifyUsername = async (username: string) => {

    if (!username || username && typeof (username) == "number" || username.includes(reservedWords)) {
        return ({ success: false, message: "username inválido" })

    } else if (username.length > 2 && username.length < 51) {

        const resp = await Usuario.findOne({ where: { username: username } })

        if (resp) {
            return ({ success: false, message: "username em uso" })
        }

    } else {
        return ({ success: false, message: "tamanho de username inválido" })
    }

    return { succes: true, message: "Correto e disponivel" }
}

export const verifySenha = async (password: string) => {

    if (password && typeof (password) == "string") {
        if (password.length > 8) {
            if (password.length < 30) {
                return ({ success: true, message: "correto" })
            } else {
                return ({ success: false, message: "tamanho de senha excedido" })
            }
        } else {
            return ({ success: false, message: "tamanho da senha é insuficiente" })
        }
    } else {
        return ({ success: false, message: "senha inválida" })
    }
}

export const update = async (data: { id: any; nome: any; email: any; senha: any; data_criacao: any; }) => {

    await validate(data)
    await getById(data.id)

    const res = await Usuario.update(
        {
            nome: data.nome,
            email: data.email,
            senha: data.senha,
            data_criacao: data.data_criacao,
            data_edicao: new Date()
        },
        {
            where: { id: data.id }
        }
    );

    return res
}

export const deleteUser = async (id: any) => {

    await getById(id)

    const resp = await Usuario.destroy({ where: { id: id } })

    return resp
}

export const getUsersByFilter = async (data: usuarioFilterDTO) => {

    if (!data.pagina || !data.tamanhoPagina) {
        throw new Error("Dados de paginação obrigatórios")
    }

    const users = await Usuario.findAll(
        {
            where: {
                [Op.or]: [
                    { nome: { [Op.iLike]: `%${data.search}%` } },
                    { username: { [Op.iLike]: `%${data.search}%` } }
                ]
            },
            attributes : ["id", "nome", "username", "img_url", [
                Sequelize.literal(`(Select count(*) From seguidor where following_id = "Usuario".id)`), "seguidores"
            ]],
            limit : data.tamanhoPagina,
            offset : (data.pagina - 1) * data.tamanhoPagina,
            order : [[Sequelize.literal("seguidores"), "DESC"]]
        },
        
    )

    return users

}