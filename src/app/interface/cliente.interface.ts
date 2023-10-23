export interface Cliente {
  id_cliente: number;
  id_empresa: number;
  no_nome: string;
  dc_email: string;
  nm_cpf: string;
  nm_celular: string;
  id_endereco: number;
  id_cadastrado_por: number;
  created_at: string;
  updated_at: string;
}

export interface Endereco {
  id_endereco: number;
  id_empresa: number;
  id_cliente: number;
  nm_cep: string;
  dc_logradouro: string;
  dc_complemento: string;
  dc_bairro: string;
  dc_cidade: string;
  dc_uf: string;
  id_cadastrado_por: number;
  created_at: string;
  updated_at: string;
}
