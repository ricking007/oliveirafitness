
export interface Usuario {
  id_usuario: number;
  id_empresa: number;
  id_usuario_tipo: number;
  no_nome: string;
  dc_email: string;
  dc_senha: string;
  created_at: string;
  updated_at: string;
  Token?: string
}

export interface UsuarioTipo {
  id_usuario_tipo: number;
  id_empresa: number;
  no_usuario_tipo: string;
  created_at: string;
  updated_at: string;
}

export interface Entidade {
  id_entidade: number;
  no_entidade: string;
  created_at: string;
  updated_at: string;
}

export interface Permissao {
  id_permissao: number;
  id_empresa: number;
  id_usuario_tipo: number;
  id_entidade: number;
  ver: boolean;
  criar: boolean;
  atualizar: boolean;
  deletar: boolean;
  created_at: string;
  updated_at: string;
}

export interface Empresa {
  id_empresa: number;
  no_empresa: string;
  nm_cnpj: string;
  dc_email: string;
  nm_celular: string;
  dc_responsavel: string;
}
