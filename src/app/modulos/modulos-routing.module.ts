import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriaComponent } from './cadastro/categoria/categoria.component';
import { CupomComponent } from './cadastro/cupom/cupom.component';
import { FormaPagamentoComponent } from './cadastro/forma-pagamento/forma-pagamento.component';
import { TransportadoraComponent } from './cadastro/transportadora/transportadora.component';
import { VariacaoComponent } from './cadastro/variacao/variacao.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "categoria",
    pathMatch: "full",
  },
  {
    path: 'categoria',
    component: CategoriaComponent,
  },
  {
    path: 'cupom',
    component: CupomComponent,
  },
  {
    path: 'forma-pagamento',
    component: FormaPagamentoComponent,
  },
  {
    path: 'transportadora',
    component: TransportadoraComponent,
  },
  {
    path: 'variacao',
    component: VariacaoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulosRoutingModule { }
