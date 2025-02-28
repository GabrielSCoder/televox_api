import { compareForm, followForm } from "../types/followT"

const { Seguidor, Usuario } = require("../models")

const validate = async (data: followForm) => {

    if (!data || !data.follower_id || !data.following_id) {
        throw new Error("Dados obrigatórios")
    } else if (data.follower_id === data.following_id) {
        throw new Error("Um usuário não pode seguir ele mesmo")
    }
    const userCheck = await Usuario.findByPk(data.follower_id)

    if (!userCheck) throw new Error("Usuario não encontrado")

    const userTarget = await Usuario.findByPk(data.following_id)
    if (!userTarget) throw new Error("Usuario para seguir não encontrado")

}

export const follow = async (data: followForm) => {

    await validate(data)

    const checkFollow = await Seguidor.findOne({ where: { follower_id: data.follower_id, following_id: data.following_id } })

    if (checkFollow) throw new Error(`Usuario ${data.follower_id} já é seguidor do usuario ${data.following_id}`)
    const rel = await Seguidor.create({ ...data, followedAt: Date.now() })

    return rel.id
}

export const unfollow = async (data: followForm) => {

    if (!data || !data.follower_id || !data.following_id) {
        return ("Dados obrigatórios")
    }

    const userCheck = await Usuario.findByPk(data.follower_id)


    if (!userCheck) return ("Usuario não encontrado")

    const userTarget = await Usuario.findByPk(data.following_id)
    if (!userTarget) return ("Usuario para deixar de seguir não encontrado")

    const checkFollow = await Seguidor.findOne({ where: { follower_id: data.follower_id, following_id: data.following_id } })

    if (!checkFollow) {
        return ("O usuário não segue ")
    }

    const del = await Seguidor.destroy({ where: { id: checkFollow.id } })

    if (!del) return ("Erro interno")

    return del
}

//todos y que x id segue
export const checkAllfollowing = async (id: number) => {
    const userCheck = await Usuario.findByPk(id);
    if (!userCheck) throw new Error("Usuário não encontrado");
    

 
    const check_x = await Seguidor.findAll({
        where: { follower_id: id },
        include: [{
            model: Usuario,
            as: "usuario_seguidores",
            attributes: ["id", "nome", "username", "img_url"]
        }]
    });

 
    const check_y = await Seguidor.findAll({
        where: { following_id: id },
        include: [{
            model: Usuario,
            as: "usuario_seguidor",
            attributes: ["id", "nome", "username", "img_url"]
        }]
    });

 
    const seguidoresMap = new Map(check_y.map((f: { usuario_seguidor: { id: any }; followedAt: any }) => [f.usuario_seguidor.id, f.followedAt]));

    
    const List = check_x.map((following: { usuario_seguidores: { dataValues: any; id: unknown }; followedAt: any }) => ({
        ...following.usuario_seguidores.dataValues,
        relacao: {
            seguindo: true, 
            seguido: seguidoresMap.has(following.usuario_seguidores.id), 
            followedAt: following.followedAt 
        } 
    }));

    return { List, TotalFollowings: List.length };
};


//todos y que seguem x id
export const checkAllfollowers = async (id: number) => {
    const userCheck = await Usuario.findByPk(id);
    if (!userCheck) throw new Error("Usuário não encontrado");

   
    const check = await Seguidor.findAll({
        where: { following_id: id },
        include: [{
            model: Usuario,
            as: "usuario_seguidor",
            attributes: ["id", "nome", "username", "img_url"]
        }]
    });

   
    const check_x = await Seguidor.findAll({
        where: { follower_id: id },
        include: [{
            model: Usuario,
            as: "usuario_seguidores",
            attributes: ["id", "nome", "username", "img_url"]
        }]
    });

    
    const seguindoMap = new Map(check_x.map((f: { usuario_seguidores: { id: any }; followedAt: any }) => [f.usuario_seguidores.id, f.followedAt]));

    
    const List = check.map((follower: { usuario_seguidor: { dataValues: any; id: unknown } }) => ({
        ...follower.usuario_seguidor.dataValues,
        relacao: {
            seguindo: seguindoMap.has(follower.usuario_seguidor.id), 
            seguido: true, 
            followedAt: seguindoMap.get(follower.usuario_seguidor.id) 
        }
    }));

    return { List, TotalFollowers: List.length };
};


export const checkXFollowY = async (data: followForm) => {

    await validate(data)

    const resp_x = await Seguidor.findOne({ where: { follower_id: data.follower_id, following_id: data.following_id } })

    const resp_y = await Seguidor.findOne({ where: { follower_id: data.following_id, following_id: data.follower_id } })

    const resp_data : { seguindo: boolean; seguido: boolean; followedAt?: Date } = {
        seguindo: !!resp_x,
        seguido: !!resp_y
    }

    if (resp_x) resp_data.followedAt = resp_x.followedAt

    return resp_data
}

export const getTotalizer = async (id: number) => {

    if (!id) {
        throw new Error("id obrigatório")
    }

    const following = await Seguidor.findAll({ where: { follower_id: id } })

    const followers = await Seguidor.findAll({ where: { following_id: id } })

    const result = { TotalFollowings: following.length, TotalFollowers: followers.length }

    return result
}

export const checkAllfollowingAndCompare = async (data: compareForm) => {
    const userCheck = await Usuario.findByPk(data.user_id);
    if (!userCheck) throw new Error("Usuário não encontrado");

    const compareCheck = await Usuario.findByPk(data.compare_id);
    if (!compareCheck) throw new Error("Usuário de comparação não encontrado");

    // 1️⃣ Pegamos a lista de usuários que `user_id` segue
    const check_x = await Seguidor.findAll({
        where: { follower_id: data.user_id },
        include: [{
            model: Usuario,
            as: "usuario_seguidores",
            attributes: ["id", "nome", "username", "img_url"]
        }]
    });

    // 2️⃣ Pegamos a lista de usuários que `compare_id` segue
    const check_y = await Seguidor.findAll({
        where: { follower_id: data.compare_id },
        include: [{
            model: Usuario,
            as: "usuario_seguidores",
            attributes: ["id"]
        }]
    });

    // 3️⃣ Pegamos a lista de usuários que seguem `compare_id`
    const check_z = await Seguidor.findAll({
        where: { following_id: data.compare_id },
        include: [{
            model: Usuario,
            as: "usuario_seguidor",
            attributes: ["id"]
        }]
    });

    // 4️⃣ Criamos mapas para armazenar relações de `compare_id`
    const seguindoMap = new Map(check_y.map((f: { usuario_seguidores: { id: any }; followedAt: any }) => [f.usuario_seguidores.id, f.followedAt]));
    const seguidoMap = new Map(check_z.map((f: { usuario_seguidor: { id: any }; followedAt: any }) => [f.usuario_seguidor.id, f.followedAt]));

    // 5️⃣ Criamos a lista final comparando os seguidos de `user_id` com as relações de `compare_id`
    const List = check_x.map((following: { usuario_seguidores: { dataValues: any; id: unknown }; followedAt: any }) => ({
        ...following.usuario_seguidores.dataValues,
        relacao: {
            seguindo: seguindoMap.has(following.usuario_seguidores.id), // Se `compare_id` segue essa pessoa
            seguido: seguidoMap.has(following.usuario_seguidores.id), // Se essa pessoa segue `compare_id`
            followedAt: following.followedAt // Data de quando `user_id` começou a seguir essa pessoa
        }
    }));

    return { List, TotalFollowings: List.length };
};

export const checkAllFollowersCompare = async (data: compareForm) => {
    const userCheck = await Usuario.findByPk(data.user_id);
    if (!userCheck) throw new Error("Usuário não encontrado");

    const compareCheck = await Usuario.findByPk(data.compare_id);
    if (!compareCheck) throw new Error("Usuário de comparação não encontrado");

    // 1️⃣ Pegamos a lista de usuários que seguem `user_id`
    const check_x = await Seguidor.findAll({
        where: { following_id: data.user_id },
        include: [{
            model: Usuario,
            as: "usuario_seguidor",
            attributes: ["id", "nome", "username", "img_url"]
        }]
    });

    // 2️⃣ Pegamos a lista de usuários que `compare_id` segue
    const check_y = await Seguidor.findAll({
        where: { follower_id: data.compare_id },
        include: [{
            model: Usuario,
            as: "usuario_seguidores",
            attributes: ["id"]
        }]
    });

    // 3️⃣ Pegamos a lista de usuários que seguem `compare_id`
    const check_z = await Seguidor.findAll({
        where: { following_id: data.compare_id },
        include: [{
            model: Usuario,
            as: "usuario_seguidor",
            attributes: ["id"]
        }]
    });

    // 4️⃣ Criamos mapas para armazenar relações de `compare_id`
    const seguindoMap = new Map(check_y.map((f: { usuario_seguidores: { id: any }; followedAt: any }) => [f.usuario_seguidores.id, f.followedAt]));
    const seguidoMap = new Map(check_z.map((f: { usuario_seguidor: { id: any }; followedAt: any }) => [f.usuario_seguidor.id, f.followedAt]));

    // 5️⃣ Criamos a lista final comparando os seguidores de `user_id` com as relações de `compare_id`
    const List = check_x.map((follower: { usuario_seguidor: { dataValues: any; id: unknown }; followedAt: any }) => ({
        ...follower.usuario_seguidor.dataValues,
        relacao: {
            seguindo: seguindoMap.has(follower.usuario_seguidor.id), // Se `compare_id` segue essa pessoa
            seguido: seguidoMap.has(follower.usuario_seguidor.id), // Se essa pessoa segue `compare_id`
            followedAt: follower.followedAt // Data de quando essa pessoa começou a seguir `user_id`
        }
    }));

    return { List, TotalFollowers: List.length };
};
