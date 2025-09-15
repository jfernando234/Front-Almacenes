import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgxBootstrapModule } from "./ngx-bootstrap/ngx-bootstrap.module";
import { SlickCarouselModule } from "ngx-slick-carousel";
import { materialModule } from "./material.module";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxBootstrapModule,
    SlickCarouselModule,
    materialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
  ],
  exports: [
    CommonModule,
    NgxBootstrapModule,
    SlickCarouselModule,
    materialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule
  ],
})
export class SharedModule {}
