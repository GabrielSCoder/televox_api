import jwt from "jsonwebtoken";
import { generateTokens } from "../services/authConfig";
import dotenv from "dotenv"
const db = require("../models");
const User = db.User;

dotenv.config()

const ACCESS_SECRET = process.env.ACCESS_SECRET || "access_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret";

export const login = async (req: { body: { email?: any; senha?: any } }, res: any) => {

    try {
        const { email, senha } = req.body
        const erros: Object[] = []

        if (!email) {
            erros.push({ campo: "email", menssagem: "Email obrigatório" })
        }

        if (!senha) {
            erros.push({ campo: "senha", menssagem: "senha obrigatória" })
        }

        if (erros.length > 0) {
            return res.status(401).json(erros)
        }

        const u = await User.findOne({ where: { email } })

        // if (!u) {
        //     return res.status(401).json({ error: "Email não encontrado!" })
        // }

        if (!u || !u.check(senha)) {
            return res.status(401).json([{ menssagem: "Email e/ou senha incorreta!" }])
        }

        const sign = jwt.sign({ id: u.id }, "aquelasenhaDaHorinha", { expiresIn: "8h" })

        return res.status(200).json({ message: "Login realizado!", sign })

    } catch (error) {
        return res.status(500).json({ error: "Erro interno" })
    }

}

export const login2 = async (req: any, res: any) => {

    const { email, senha } = req.body;

    const erros: Object[] = []

    if (!email) {
        erros.push({ campo: "email", menssagem: "Email obrigatório" })
    }

    if (!senha) {
        erros.push({ campo: "senha", menssagem: "senha obrigatória" })
    }

    if (erros.length > 0) {
        return res.status(401).json(erros)
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !user.check(senha)) {
        return res.status(401).json([{ menssagem: "Email e/ou senha incorreta!" }])
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Strict",
        domain: "localhost",
        path: "/auth/refresh",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({ usuario_id: user.id, message: "Login realizado!", token: accessToken })
};

export const checkLogin = (req: any, res: any) => {

    try {
        const accessToken = req.headers['authorization'];

        if (!accessToken) {
            return res.status(401).json({ success: false, error: "Não autorizado" });
        }

        const token = accessToken.split(' ')[1];


        const decoded = jwt.verify(token, process.env.ACCESS_SECRET as string);

        if (typeof decoded !== "object" || !decoded.id) {
            return res.status(401).json({ error: "Token inválido" });
        }

        return res.json({ success: true, dados: { id: decoded.id } });
    } catch (error) {
        return res.status(401).json({ success: false, error: "Token inválido ou expirado" });
    }
};

export const logout = (req: any, res: any) => {
    try {
        res.cookie("refreshToken", "", {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
            domain: "localhost",
            path: "/auth/refresh",
            expire: new Date(0)
        })

        return res.status(200).json({ success: true, message: "Logout realizado!" });
        
    } catch (error) {
        return res.status(500).json({ success : false, message : error})
    }
}