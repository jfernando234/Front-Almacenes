import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgxBootstrapModule } from "./ngx-bootstrap/ngx-bootstrap.module";


import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from "./material.module";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxBootstrapModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule
  ],
  exports: [
    CommonModule,
    NgxBootstrapModule,

    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule
  ],
})
export class SharedModule {}
