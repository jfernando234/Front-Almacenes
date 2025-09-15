import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClClientesRoutingModule } from './cl-clientes-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClClientesComponent } from './cl-clientes.component';


@NgModule({
  declarations: [ClClientesComponent],
  imports: [CommonModule,ClClientesRoutingModule,SharedModule]
})
export class ClClientesModule { }
