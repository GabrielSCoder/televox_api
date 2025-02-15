import { baseT } from "./baseT"

export type usuarioForm = {
    nome: string
    email: string
    password: string
    data_nascimento : string
    genero : string
    img_url ?: string
    username : string
} & baseT

export type usuarioDTO = {
    nome: string
    username : string
    email: string
    data_nascimento : string
    genero : string
    img_url : string
} & baseT

export type usuarioAnyDTO = {
    id : number
    nome : string
    username : string
}