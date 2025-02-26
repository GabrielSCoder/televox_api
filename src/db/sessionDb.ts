import { sessaoForm } from "../types/sessaoT";

const { Sessao, Usuario } = require("../models")

export async function CreateSession(data: sessaoForm) {

    if (data && data.dispositivo_id && typeof (data.usuario_id) == "number") {
        const usuarioCheck = await Usuario.findByPk(data.usuario_id)

        if (usuarioCheck) {
            const device_check = await Sessao.findOne({ where: { dispositivo_id: data.dispositivo_id } })

            if (!device_check) {
                const create = await Sessao.create({ ...data, data_login: Date.now() })

                if (create) {
                    return create
                } else {
                    throw new Error("Erro interno")
                }

            } else {
                throw new Error("dispositivo já possui sessão ativa")
            }
        } else {
            throw new Error("Usuário não existe")
        }
    } else {
        throw new Error("Dados obrigatórios")
    }
}

export async function FinishSession(data: any) {

    if (data && data.usuario_id && data.dispositivo_id) {
        const check_sessao = await Sessao.findOne({ where: { dispostivo_id: data.dispositivo_id, usuario_id: data.usuario_id } })

        if (check_sessao) {
            const del = await Sessao.destroy(check_sessao.id)
            if (del) return del
        } else {
            throw new Error("sessão não encontrada")
        }
    } else {
        throw new Error("Dados obrigatórios")
    }
}

export async function CheckSession(data: any) {

    if (data && data.usuario_id && data.dispositivo_id) {
        const check_sessao = await Sessao.findOne({ where: { dispositivo_id: data.dispositivo_id, usuario_id: data.usuario_id } })

        if (check_sessao) {
            return check_sessao
        } else {
            throw new Error("sessão não encontrada")
        }
    } else {
        throw new Error("Dados obrigatórios")
    }
}
