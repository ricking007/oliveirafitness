import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModulosRoutingModule } from './modulos-routing.module';
import { ComponentDefaultFormComponent } from '../modulos/component-default/component-default-form/component-default-form.component';
import { ComponentDefaultComponent } from '../modulos/component-default/component-default.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CategoriaComponent } from '../modulos/cadastro/categoria/categoria.component';
import { VariacaoComponent } from '../modulos/cadastro/variacao/variacao.component';
import { TransportadoraComponent } from '../modulos/cadastro/transportadora/transportadora.component';
import { CupomComponent } from '../modulos/cadastro/cupom/cupom.component';
import { FormaPagamentoComponent } from '../modulos/cadastro/forma-pagamento/forma-pagamento.component';
import { ComponentsModule } from '@shared/components/components.module';
import { MatIconModule } from '@angular/material/icon';
import { CategoriaFormComponent } from '../modulos/cadastro/categoria/categoria-form/categoria-form.component';
import { SharedModule } from '@shared/shared.module';
import { CategoriaService } from './cadastro/categoria/categoria.service';

@NgModule({
  declarations: [
    ComponentDefaultFormComponent,
    ComponentDefaultComponent,
    CategoriaComponent,
    VariacaoComponent,
    TransportadoraComponent,
    CupomComponent,
    FormaPagamentoComponent,
    CategoriaFormComponent,
  ],
  imports: [
    CommonModule,
    ModulosRoutingModule,
    NgbModule,
    ComponentsModule,
    MatIconModule,
    SharedModule,
  ],
  providers: [CategoriaService],
})
export class ModulosModule { }
