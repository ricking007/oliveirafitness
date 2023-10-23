export interface Pedido {
  id_pedido: number;
  id_empresa: number;
  id_cliente: number;
  id_origem: number;
  dc_codigo: string;
  id_endereco: number;
  dt_cadastro: string;
  nm_valor: number;
  nm_porcentagem_desconto: number;
  id_cupom: number;
  id_transportadora: number;
  dc_codigo_rastreio: string;
  dc_observacao: string;
  id_cadastrado_por: number;
  created_at: string;
  updated_at: string;
}

export interface Transportadora {
  id_transportadora: number;
  id_empresa: number;
  no_transportadora: string;
  dc_email: string;
  nm_celular: string;
  id_cadastrado_por: number;
  created_at: string;
  updated_at: string;
}

export interface PedidoStatus {
  id_pedido_status: number;
  id_empresa: number;
  id_status_pedido: number;
  dt_cadastro: string;
  id_cadastrado_por: number;
  created_at: string;
  updated_at: string;
}

export interface StatusPedido {
  id_status_pedido: number;
  id_empresa: number;
  no_status_pedido: string;
  id_cadastrado_por: number;
  created_at: string;
  updated_at: string;
}

export interface PedidoItem {
  id_pedido_item: number;
  id_empresa: number;
  id_pedido: number;
  id_produto: number;
  id_estoque: number;
  nm_quantidade: number;
  nm_valor: number;
  id_cadastrado_por: number;
  created_at: string;
  updated_at: string;
}

export interface Cupom {
  id_cupom: number;
  id_empresa: number;
  no_cupom: string;
  nm_porcentagem_desconto: number;
  id_cadastrado_por: number;
  created_at: string;
  updated_at: string;
}

export interface FormaPagamento {
  id_forma_pagamento: number;
  id_empresa: number;
  no_forma_pagamento: string;
  id_cadastrado_por: number;
  created_at: string;
  updated_at: string;
}
