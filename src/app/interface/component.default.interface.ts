/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormControl } from '@angular/forms';
import { FormField } from './form_field.interface';

export interface IComponentDefault {
    rota?: string;
    header?: string;
    label?: string;
    campos?: ICamposDefault;
    entidade?: number;
    fields?: IField[];
    size_modal_form?: any;
    form_name?: string;
    inputs?: IInputGroup[];
    // inputs?: FormField<string>[];
    id_update_name?: string;
    id_update_id?: number;
    btn_delete?: boolean;
    btn_edit?: boolean;
    btn_ver?: boolean;
    consulta_atendimento?: boolean;
    id_atendimento?: number;
    print?: IPrintDefault;
    printInForm?: IPrintDefault;
    id_licitacao?: number;
    tabela?: string;
    menu?: number;
    joins?: IJoin[];
    orderBy?: IOrderBy[];
    groupBy?: IGroupBy[];
    filter?: boolean;
    whereHes?: IWhereHes[];
    withs?: IWith[];
    model?: string;
    counts?: ICountColumn[];
    setValues?: ISetValues[];
    set_data_atual?: string;
    orderByRaw?: IOrderByRaw;
    documento?: IDocumento;
    enviaEmail?: any;
    emailTipo?: any;
    where?: IWhere[];
}

export interface IWhere{
  column: string,
  condition: any;
  value: any;
}

export interface IInputGroup {
  title: string,
  inputs: FormField<string>[];
  divider?: boolean;
  ocultarHeader?: boolean;
}

export interface IJoin {
  table?: string;
  foreignkey?: string;
  joinKey?: string;
  label?: string;
  alias?: string;
  prefixo?: string;
  joins?: IJoin[];
  multipleLabel?: IMultipleLabel[],
}

export interface ICountColumn {
  campo?: string;
  alias?: string;
  prefixo?: string;
}

export interface IMultipleLabel {
  label?: string;
  alias?: string;
}

export interface IWhereHes {
  table?: string;
  foreignkey?: string;
  value?: string;
}

export interface IOrderBy {
  table?: string;
  column?: string;
  label?: string;
  codition: string;
}

export interface IGroupBy {
  prefixo?: string;
  column: string;
}

export interface IPrintDefault {
    rota?: string;
    campo_id?: string;
    id?: string;
    isDownload?: boolean;
}

export interface ICamposDefault {
    id?: string;
    nome?: string;
}

export interface IGradeButton {
    id: string;
    icon: string;
    class: string;
    label?: string;
    title: string;
    regraVisivel?: any;
    regraLabel?: string;
    regraVisivelLength?: string;
}


export interface IField {
    primary?: boolean;
    model?: string; // ng-model no component
    modelComponent?: IFieldModel;
    label?: string;
    exibe_index?: boolean;
    form_control?: FormControl;
    isDateType?: boolean;
    isHourType?:boolean;
    isTimeDate?: boolean;
    limiteCaracteres?: boolean;
    withImage?: boolean;
    multipleLabel?: boolean;
    labelPosition?: ILabelPosition
    imageClicable?: boolean;
    style?: any;
    openAssociado?: boolean;
    width?: any;
    isIcon?: boolean;
    isExecutores?: boolean;
}

export interface IFieldModel {
  label: string; // nome da chave no array que vem nos withs
  value?: string; // campo que será chamado
  modelComponent?: IFieldModel
}

export interface ILabelPosition {
    posicao?: number;
    label?: string;
    value?: string;
    labelPosition?: ILabelPosition,
    legenda?: string; //Associados; Outros números etc
}

export interface IWith {
  join?: IJoin;
  label?: string;
}

export interface ISetValues {
  input: string;
  value: any;
}

export interface IOrderByRaw {
  alias: string;
  campo: string;
  orderBy: string;
}

export interface IDocumento {
  tipoObjeto: string;
  IDDocumentoTipo: number;
  IDObjeto?: number;
}


