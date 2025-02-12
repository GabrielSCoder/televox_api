import { create, deletePost, editPost, getAllPostByIdUser, getById, getPostsByFilter } from "../db/postDb"

type resType = {
    status: (code: number) => any;
    json: (data: any) => void
}

export const postAsync = async (req: { body: any }, res: resType) => {
    try {
        const resp = await create(req.body)
        return res.status(200).json({success : true, dados : resp})
    } catch (error : any) {
        return res.status(500).json({success : false, error : error.message})
    } 
}

export const updateAsync = async (req: { body: any }, res: resType) => {
    try {
        const resp = await editPost(req.body)
        return res.status(200).json(resp)
    } catch (error : any) {
        return res.status(500).json({error : error.message})
    }
}

export const deleteAsync = async (req: { params: {id : number} }, res: resType) => {
    try {
        const resp = await deletePost(req.params.id)
        return res.status(200).json(resp)
    } catch (error : any) {
        return res.status(500).json({error : error.message})
    }   
}

export const getAsync = async (req: { params: {id : number} },  res: resType) => {
    try {
        const resp = await getById(req.params.id)
        return res.status(200).json(resp)
    } catch (error : any) {
        return res.status(500).json({error : error.message})
    }
}

export const getAllByUserAsync = async (req: { params: {id : number} },  res: resType) => {
    try {
        const resp = await getAllPostByIdUser(req.params.id)
        return res.status(200).json({success : true, dados : resp})
    } catch (error : any) {
        return res.status(500).json({success : false, error : error.message})
    }
}

export const getByFilterAsync = async (req: { body : any },  res: resType) => {
    try {
        const resp = await getPostsByFilter(req.body)
        return res.status(200).json({success : true, dados : resp})
    } catch (error : any) {
        return res.status(500).json({success : false, error : error.message})
    }
}