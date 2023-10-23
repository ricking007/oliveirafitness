/* eslint-disable @typescript-eslint/ban-types */
import { IComponentDefault } from './component.default.interface';
export interface IMenuConfiguracoes {
    icon?: string
    title?: string
    route?: string
    sistema?: number
    visible?: Boolean
    entidade?:number
    component?: IComponentDefault
}
