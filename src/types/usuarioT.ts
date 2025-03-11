import { baseT } from "./baseT"

export type usuarioForm = {
    nome: string
    email: string
    password: string
    data_nascimento : string
    texto_bio ?: string
    genero : string
    img_url ?: string
    background_url ?: string
    username : string
} & baseT

export type usuarioDTO = {
    nome: string
    username : string
    email: string
    data_nascimento : string
    genero : string
    img_url : string
    background_url ?: string
    texto_bio ?: string
} & baseT

export type usuarioAnyDTO = {
    id : number
    nome : string
    username : string
}

export type usuarioFilterDTO = {
    search : string
    tamanhoPagina : number
    pagina : number
    filtro : string
}