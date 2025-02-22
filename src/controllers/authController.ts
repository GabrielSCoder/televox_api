import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import { getById } from "../db/userDb";
const db = require("../models");
const User = db.Usuario;

dotenv.config()

export const generateTokens = (user: { id: any; }) => {
    const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_SECRET as string, { expiresIn: "30min" });
    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET as string, { expiresIn: "1d" });

    return { accessToken, refreshToken };
};


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
        path: "/auth"
    });

    return res.status(200).json({ usuario_id: user.id, message: "Login realizado!", token: accessToken })
};

//checa o token de acesso e retorna o Id do usuario
export const checkLogin = async (req: any, res: any) => {

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

        const user = await getById(decoded.id)

        return res.json({ success: true, user });

    } catch (error) {
        return res.status(401).json({ success: false, error: "Token inválido ou expirado" });
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

        return res.status(200).json({ success: true, message: "Logout realizado!" });
        
    } catch (error) {
        return res.status(500).json({ success : false, message : error})
    }
}


//verifica se o token refresh é valido e gera outro conjunto access/refresh
export const refreshToken = async (req: any, res: any) => {

    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ success: false, error: "Sem refresh token" });

    jwt.verify(token, process.env.REFRESH_SECRET as string, (err: any, user: any) => {

        if (err) return res.status(403).json({ success: false, error: "Refresh token inválido" });

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
            path: "/auth"
        });

        res.json({ success: true, token: accessToken });
    });
};


//concede um novo codigo de acesso
export const newAccessToken = async (req: any, res: any) => {

    const token = req.cookies.refreshToken;

    if (!token) return res.status(401).json({ success: false, error: "Sem refresh token" });

    try {

        const decoded = jwt.verify(token, process.env.REFRESH_SECRET as string);

        if (typeof decoded !== "object" || !decoded.id) {
            return res.status(401).json({ error: "Refresh token expirado ou inválido" });
        }
    
        const accessToken = jwt.sign({ id: decoded.id },  process.env.ACCESS_SECRET as string, { expiresIn: "15s" });
    
        res.json({ success: true, token: accessToken });

    } catch (error) {

        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: "Refresh token expirado" });
        }
        return res.status(401).json({ error: "Erro ao validar o refresh token" });
    }

  

};

//verifica o token de acesso e permite a requisição
export const authenticate = (req: any, res: any, next: any) => {

    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: "Token ausente" });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Token inválido" });
    }


    jwt.verify(token,  process.env.ACCESS_SECRET as string, (err: any, user: any) => {
        if (err) {
            return res.status(403).json({ error: "Token inválido ou expirado" });
        }

        req.user = user;
        next();
    });
};

