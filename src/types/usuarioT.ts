import { baseT } from "./baseT"

export type usuarioForm = {
    nome: string
    email: string
    password: string
    data_nascimento : Date
    genero : string
    img_url : string
} & baseT

export type usuarioDTO = {
    nome: string
    email: string
    data_nascimento : Date
    genero : string
    img_url : string
} & baseT