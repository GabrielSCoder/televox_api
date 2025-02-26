import { CheckSession, CreateSession, FinishSession } from "../db/sessionDb"

type resType = {
    status: (code: number) => any;
    json: (data: any) => void
}

export const postAsync = async (req: { body: any }, res: resType) => {
    try {
        const resp = await CreateSession(req.body)
        return res.status(200).json({success : true, dados : resp})
    } catch (error : any) {
        return res.status(500).json({success : false, error : error.message})
    } 
}

export const checkAsync = async (req: { body: any }, res: resType) => {
    try {
        const resp = await CheckSession(req.body)
        return res.status(200).json({success : true, dados : resp})
    } catch (error : any) {
        return res.status(500).json({success : false, error : error.message})
    }
}

export const deleteAsync = async (req: { body: any }, res: resType) => {
    try {
        const resp = await FinishSession(req.body)
        return res.status(200).json({success : true, dados : resp})
    } catch (error : any) {
        return res.status(500).json({success : false, error : error.message})
    }
}