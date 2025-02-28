import { baseT } from "./baseT"

export type postForm = {
    tipo : string
    conteudo : string
    usuario_id : number
} & baseT

export type postDTO = {
    tipo : string
    conteudo : string
    usuario_id : number
} & baseT

export type postListDTO = {
    quantidade_postagens : number
    listaPostagens : Array <postDTO>
}

export type postFilterDTO = {
    usuario : string | number
    tamanhoPagina : number
    numeroPagina : number
}

export type feedFilterDTO = {
    id : string | number
    tamanhoPagina : number
    numeroPagina : number
}

export type responsePostFilterDTO = {
    pagina : number
    numeroPaginas : number
} & postListDTO


export type reactPostForm = {
    post_id : number
    usuario_id : number
}