export interface Produto {
  id_produto: number;
  id_empresa: number;
  id_categoria: number;
  cd_ean: string;
  no_nome: string;
  dc_descricao: string;
  nm_valor: number;
  nm_valor_promocional: number;
  dc_peso: string;
  dc_comprimento: string;
  dc_altura: string;
  dc_largura: string;
  id_cadastrado_por: number;
  created_at: string;
  updated_at: string;
}

export interface Categoria {
  id_categoria: number;
  id_empresa: number;
  no_categoria: string;
  id_categoria_pai: number;
  id_cadastrado_por: number;
  created_at: string;
  updated_at: string;
}
