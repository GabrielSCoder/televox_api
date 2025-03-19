
type resType = {
    status: (code: number) => any;
    json: (data: any) => void
    cookie: any
}


export const login = async (req: { body: any, headers: any, cookies: any }, res: resType) => {

    try {

        return res.status(200).json({ success: true, message: "Login realizado!" })

    } catch (error: any) {
        return res.status(401).json({ success: false, error: error.message })
    }
}


export const meetAsync = async (req: any, res: any, next: any) => { 
    return res.status(200).json({success : true, dados : "Olá, esse é a api do webvox!"})
}