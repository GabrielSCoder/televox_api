import { baseT } from "./baseT"

export type postForm = {
    tipo : string
    conteudo : string
    usuario_id : number
    reacao_gostei : number | 0
    reacao_nao_gostei : number | 0
    qtd_comentarios : number | 0
    qt_compartilhamentos : number | 0
} & baseT

export type postDTO = {
    tipo : string
    conteudo : string
    usuario_id : number
    reacao_gostei : number
    reacao_nao_gostei : number
    qtd_comentarios : number
    qt_compartilhamentos: number
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

export type responsePostFilterDTO = {
    pagina : number
    numeroPaginas : number
} & postListDTO
