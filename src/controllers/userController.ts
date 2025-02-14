import { create, deleteUser, getById, update, getByUsername, verifyEmail } from "../db/userDb"

type resType = {
    status: (code: number) => any;
    json: (data: any) => void
}

export const postAsync = async (req: { body: any }, res: resType) => {
    try {
        const resp = await create(req.body)
        return res.status(200).json(resp)
    } catch (error : any) {
        return res.status(500).json({error : error.message})
    } 
}

export const updateAsync = async (req: { body: any }, res: resType) => {
    try {
        const resp = await update(req.body)
        return res.status(200).json(resp)
    } catch (error : any) {
        return res.status(500).json({error : error.message})
    }
}

export const deleteAsync = async (req: { params: {id : number} }, res: resType) => {
    try {
        const resp = await deleteUser(req.params.id)
        return res.status(200).json(resp)
    } catch (error : any) {
        return res.status(500).json({error : error.message})
    }   
}

export const getAsync = async (req: { params: {id : number} },  res: resType) => {
    try {
        const resp = await getById(req.params.id)
        return res.status(200).json({success : true, dados : {...resp}})
    } catch (error : any) {
        return res.status(500).json({success : false, error : error.message})
    }
}

export const verifyEmailAsync = async (req: { body: {email : string} },  res: resType) => {

    try {
        const resp = await verifyEmail(req.body.email)
        return res.status(200).json(resp)
    } catch (error : any) {
        return res.status(500).json({error : error.message})
    }
}

export const getUsernameAsync = async (req : {params : {username : string}}, res : resType) => {
    try {
        const resp = await getByUsername(req.params.username)
        return res.status(200).json({success : true, dados : resp})
    } catch (error : any) {
        return res.status(404).json({success : false, error : error.message})
    }
}
