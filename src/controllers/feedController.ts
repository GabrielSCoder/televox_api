import { feedMk1, feedMk2 } from "../db/postDb"

type resType = {
    status: (code: number) => any;
    json: (data: any) => void
}

export const getAsyncMk1 = async (req: { body: any }, res: resType) => {
    try {
        const resp = await feedMk1(req.body)
        return res.status(200).json({success : true , dados : resp})
    } catch (error : any) {
        return res.status(500).json({success : false , error : error.message})
    } 
}

export const getAsyncMk2 = async (req: { body: any }, res: resType) => {
    try {
        const resp = await feedMk2(req.body)
        return res.status(200).json({success : true , dados : resp})
    } catch (error : any) {
        return res.status(500).json({success : false , error : error.message})
    } 
}