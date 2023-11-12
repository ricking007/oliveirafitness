import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsRoutingModule } from './components-routing.module';
import { TableComponent } from '../components/table/table.component';
import { FilterComponent } from '../components/filter/filter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TableComponent,
    FilterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsRoutingModule
  ]
})
export class ComponentsModule { }
