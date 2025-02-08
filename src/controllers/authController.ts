import jwt from "jsonwebtoken";
const db = require("../models");
const User = db.User;

export const login = async (req: { body: { email: any; senha: any } }, res: any) => {

    try {
        const { email, senha } = req.body

        const u = await User.findOne({ where: { email } })

        if (!u) {
            return res.status(401).json({ error: "Email não encontrado!" })
        }

        if (!u.check(senha)) {
            return res.status(401).json({ error: "Senha incorreta!" })
        }

        const sign = jwt.sign({ id: u.id }, "aquelasenhaDaHorinha", { expiresIn: "8h" })

        return res.status(200).json({message: "Login realizado!", sign })

    } catch (error) {
        return res.status(500).json({error : "Erro interno"})  
    }

}
