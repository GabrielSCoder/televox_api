import { baseT } from "./baseT"

export type postCreateDTO = {
    id ?: number
    tipo : string
    conteudo : string
    usuario_id : number
    parent_id ?: number
}

export type postForm = {
    tipo : string
    conteudo : string
    usuario_id : number
    total_reactions : number
    parent_id ?: number
} & baseT

export type postDTO = {
    tipo : string
    conteudo : string
    usuario_id : number
    total_reactions : number
    parent_id ?: number
} & baseT

export type postListDTO = {
    quantidade_postagens : number
    listaPostagens : Array <postDTO>
}

export type baseFilterDTO = {
    tamanhoPagina : number
    numeroPagina : number
}

export type postFilterDTO = {
    usuario : string | number
} & baseFilterDTO

export type replyFilterDtO = {
    id : number
    profile_id ?: number
} & baseFilterDTO

export type feedFilterDTO = {
    id : string | number
} & baseFilterDTO

export type responsePostFilterDTO = {
    pagina : number
    numeroPaginas : number
} & postListDTO


export type reactPostForm = {
    post_id : number
    usuario_id : number
}

export type getPostForm = {
    id : number
    profile_id ?: number
}