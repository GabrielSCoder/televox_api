import { sessaoForm } from "../types/sessaoT";

const { Sessao, Usuario } = require("../models")

export async function CreateSession(data: sessaoForm, res: any) {
    console.log(data)
    if (data.fingerPrint && data.ip && data.os && data.usuario_id) {
        const newsession = { os_browser: data.os, fingerprint_id: data.fingerPrint, ip_address: data.ip, usuario_id: data.usuario_id, data_login: Date.now() }
        console.log("\n-------newsession--------------\n", newsession)
        const check = await Usuario.findByPk(data.usuario_id)

        if (!check)
        return res.status(401).json({ success: false, error: "Usuário não encontrado" })

        const s = await Sessao.create(newsession)

        if (!s) return res.status(401).json({ success: false, error: "Erro na criação da sessão" })

        res.cookie("riptn", data.fingerPrint, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            // domain: "localhost",
            path: "/",
            maxAge: 2 * 24 * 60 * 60 * 1000
        })

        res.cookie("seddra", s.ip_address, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            // domain: "localhost",
            path: "/",
            maxAge: 2 * 24 * 60 * 60 * 1000
        })

        return s
    } else {
        return res.status(401).json({ success: false, error: "Dados obrigatórios"})
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
