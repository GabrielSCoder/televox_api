import { where } from "sequelize";
import { usuarioAnyDTO, usuarioDTO, usuarioForm } from "../types/usuarioT";

const { User } = require("../models");

const validate = async (data: any) => {

    var erros: string[] = []

    if (!data.nome || data.nome == "") {
        erros.push("Nome vazio")
    }

    if (!data.email || data.email == "") {
        erros.push("Email vazio")

    } else {

        const exists = await User.findOne({ where: { email: data.email } })

        if (exists) {
            erros.push("Email já cadastrado")
        }
    }

    if (!data.username || data.username == "") {

        erros.push("Nome de usuário obrigatório")

    } else {
        const userExists = await User.findOne({ where: { username: data.username } })

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
        img_url: data.img_url,
        data_nascimento: data.data_nascimento,
        data_criacao: data.data_criacao,
        data_modificacao: data.data_modificacao
    }

    return item
}

const convertToAnnymoDTO = async (data : usuarioDTO) => {

    var item : usuarioAnyDTO = {
        id : data.id,
        nome : data.nome,
        username : data.username
    }

    return item
}

export const create = async (data: { nome: any; email: any; password: any; username: string }) => {

    console.log(data)
    await validate(data)

    const user = await User.create({ ...data, data_criacao: Date.now(), data_nascimento: Date.now() });

    return user
}

export const getById = async (id: any) => {

    const resp = await User.findByPk(id)

    if (!resp) throw new Error("Usuario não encontrado")

    return await convertToDTO(resp)
}

export const getByUsername = async (username: string) => {

    console.log("username", username)

    const resp = await User.findOne({ where: { username: username } })

    if (!resp) throw new Error("Username não encontrado")

    return await convertToDTO(resp)
}

export const update = async (data: { id: any; nome: any; email: any; senha: any; data_criacao: any; }) => {

    await validate(data)
    await getById(data.id)

    const res = await User.update(
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

    const resp = await User.destroy({ where: { id: id } })

    return resp
}
