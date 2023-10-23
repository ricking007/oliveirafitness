/* eslint-disable @typescript-eslint/no-explicit-any */

import { Permissao, Usuario } from "./usuario.interface"

export interface IResponse {
    success?: boolean
    message?: string
    data?: any
    permissao?: Permissao[],
    usuario?: Usuario,
    token?: any,
}
