export interface IRequest {
    url: string
    options?: {}
    httpOptions?: {}
    authenticate?: boolean
    id?: Number,
    id_description?: string
    isUpdate?: boolean
    urlLivre?: boolean
    isNotLoad?: boolean
}
