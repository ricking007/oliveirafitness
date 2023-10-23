export interface Estoque {
  id_estoque: number;
  id_empresa: number;
  id_produto: number;
  id_unidade_medida: number;
  nm_estoque: number;
  nm_valor_compra: number;
  nm_valor_venda: number;
  id_cadastrado_por: number;
  created_at: string;
  updated_at: string;
}

export interface EstoqueVariacao {
  id_estoque_variacao: number;
  id_empresa: number;
  id_variacao_opcao: number;
  id_cadastrado_por: number;
  created_at: string;
  updated_at: string;
}

export interface Variacao {
  id_variacao: number;
  id_empresa: number;
  no_variacao: string;
  id_cadastrado_por: number;
  created_at: string;
  updated_at: string;
}

export interface VariacaoOpcao {
  id_variacao_opcao: number;
  id_empresa: number;
  no_variacao_opcao: string;
  id_cadastrado_por: number;
  created_at: string;
  updated_at: string;
}
