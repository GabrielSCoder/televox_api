import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import { getById } from "../db/userDb";
import { CreateSession } from "../db/sessionDb";
import { TIME_LIMIT } from "../utils/parameters";
const db = require("../models");
const User = db.Usuario;
const Sessao = db.Sessao

dotenv.config()

export const generateTokens = (user: { id: any; }) => {
    const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_SECRET as string, { expiresIn: "2min" });
    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET as string, { expiresIn: "1d" });

    return { accessToken, refreshToken };
};


export const login2 = async (req: any, res: any) => {

    const { email, senha, os, ip, finger } = req.body;

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
        path: "/auth"
    });

    const s = await CreateSession({fingerPrint : finger, ip : ip, os : os, usuario_id : user.id}, res)

    if (!s) throw new Error("Erro de criação de sessão")

    return res.status(200).json({ usuario_id: user.id, message: "Login realizado!", token: accessToken })
};

//checa o token de acesso e retorna o Id do usuario
export const checkLogin = async (req: any, res: any) => {
    const accessToken = req.headers["authorization"];
    const hmac = req.headers["hmac"];
    const refreshToken = req.cookies.refreshToken;
    const fingerPrint = req.cookies.riptn;
    const seddra = req.cookies.seddra

    if (!accessToken || !refreshToken || !fingerPrint) {
        return res.status(401).json({ success: false, error: "Não autorizado" });
    }

    const token = accessToken.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET as string);

        if (typeof decoded !== "object" || !decoded.id) {
            return res.status(401).json({ error: "Token inválido" });
        }

        const checkPrint = await Sessao.findOne({where : {fingerprint_id : fingerPrint, usuario_id : decoded.id, ip_address : seddra}})

        if (!checkPrint) {
            return res.status(403).json({ error: "Dados da sessão não conferem." });
        }

        if (hmac !=  checkPrint.ip_address) {
            return res.status(403).json({ error: "Dados de hmac não conferem." });
        }

        const user = await getById(decoded.id);
        return res.json({ success: true, user });

    } catch (err: any) {
        if (err.name === "TokenExpiredError") {
            if (!refreshToken) {
                return res.status(403).json({ error: "Sessão expirada. Faça login novamente." });
            }

            try {
                const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_SECRET as string);

                if (typeof decodedRefresh !== "object" || !decodedRefresh.id) {
                    return res.status(403).json({ error: "Refresh token inválido." });
                }

                const { accessToken } = generateTokens({ id: decodedRefresh.id });

             
                const user = await getById(decodedRefresh.id);
                return res.json({ success: true, user, newToken: accessToken });

            } catch (refreshErr) {
                return res.status(403).json({ error: "Refresh token expirado. Faça login novamente." });
            }
        }

        return res.status(401).json({ error: "Token inválido." });
    }
};


//limpa o token refresh
export const logout = (req: any, res: any) => {
    try {
        res.cookie("refreshToken", "", {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
            domain: "localhost",
            path: "/auth",
            expire: new Date(0)
        })

        res.cookie("seddra", "", {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
            domain: "localhost",
            path: "/auth",
            expire: new Date(0)
        })

        res.cookie("riptn", "", {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
            domain: "localhost",
            path: "/auth",
            expire: new Date(0)
        })

        return res.status(200).json({ success: true, message: "Logout realizado!" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error })
    }
}


//verifica o token de acesso e permite a requisição
export const authenticate = (req: any, res: any, next: any) => {

    const authHeader = req.headers['authorization'];
    const Timestamp = req.headers['timestamp'];
    const now = Date.now()

    if (!Timestamp) {
        return res.status(401).json({ error: "Requisição sem timestamp" });
    }

    if (now - Timestamp > TIME_LIMIT) {
        return res.status(401).json({ error: "Requisição expirada" });
    }

    if (!authHeader) {
        return res.status(401).json({ error: "Token ausente" });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Token inválido" });
    }


    jwt.verify(token, process.env.ACCESS_SECRET as string, (err: any, user: any) => {
        if (err) {
            return res.status(401).json({ error: "Token inválido ou expirado" });
        }

        req.user = user;
        next();
    });
};

