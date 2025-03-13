import { create, destroy, getNotificationsByUserId } from "../db/notification";

type resType = {
    status: (code: number) => any;
    json: (data: any) => void
}

export const createAsync = async (req: { body: any }, res: resType) => {
    try {
        const resp = await create(req.body)
        return res.status(200).json({success : true, dados : resp})
    } catch (error : any) {
        return res.status(500).json({success : false, error : error.message})
    } 
}

export const getAllByIdAsync = async (req: { params: {id : number} }, res: resType) => {
    try {
        const resp = await getNotificationsByUserId(req.params.id)
        return res.status(200).json({success : true, dados : resp})
    } catch (error : any) {
        return res.status(500).json({success : false, error : error.message})
    } 
}

export const deleteAsync = async (req: { params: {id : number} }, res: resType) => {
    try {
        const resp = await destroy(req.params.id)
        return res.status(200).json({success : true, dados : resp})
    } catch (error : any) {
        return res.status(500).json({success : false, error : error.message})
    } 
}