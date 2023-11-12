/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatDate } from '@angular/common';
export class Categoria {
  id_categoria: number;
  id_empresa: number;
  no_categoria: string;
  id_categoria_pai: number;
  id_cadastrado_por: number;
  created_at: any;
  updated_at: any;
  empresa: any;
  cadastrado_por: any;
  constructor(categoria: Categoria) {
    {
      this.id_categoria = categoria.id_categoria || this.getRandomID();
      this.id_empresa = categoria.id_empresa || 0;
      this.no_categoria = categoria.no_categoria || '';
      this.id_categoria_pai = categoria.id_categoria_pai || 0;
      this.id_cadastrado_por = categoria.id_cadastrado_por || 0;
      this.created_at = formatDate(new Date(), 'dd-MM-yyyy', 'en') || new Date();
      this.updated_at = formatDate(new Date(), 'dd-MM-yyyy', 'en') || new Date();
      this.empresa = categoria.empresa || null;
      this.cadastrado_por = categoria.cadastrado_por || null;
    }
  }
  public getRandomID(): number {
    const S4 = () => {
      return ((1 + Math.random()) * 0x10000) | 0;
    };
    return S4() + S4();
  }
}
