import jwt from 'jsonwebtoken';
import dotenv from "dotenv"

dotenv.config()

const ACCESS_SECRET = process.env.ACCESS_SECRET || "access_secret";
const REFRESH_SECRET =  process.env.REFRESH_SECRET || "refresh_secret";

export const generateTokens = (user: { id: any; }) => {
    const accessToken = jwt.sign({ id: user.id }, ACCESS_SECRET, { expiresIn: "5m" });
    const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: "7d" });

    return { accessToken, refreshToken };
};

export const refreshToken = async (req : any, res : any) => {

    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({success: false, error: "Sem refresh token" });

    jwt.verify(token, REFRESH_SECRET, (err : any, user : any) => {
        if (err) return res.status(403).json({success: false, error: "Refresh token inválido" });

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
            path: "/auth/refresh",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({success: true, token: accessToken });
    });
};

export const authenticate = (req: any, res: any, next: any) => {

    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: "Token ausente" });
    }

 
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Token inválido" });
    }

    console.log("O token é", token);

    jwt.verify(token, ACCESS_SECRET, (err: any, user: any) => {
        if (err) {
            return res.status(403).json({ error: "Token inválido ou expirado" });
        }

        req.user = user; 
        next();  
    });
};

