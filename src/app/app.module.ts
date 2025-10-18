import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { RouterModule } from '@angular/router';

//ANGULAR MATERIAL
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSortModule } from '@angular/material/sort';

//COMPONENTES
import { SegLoginComponent } from './Modulo-seguridad/Components/SEG-autenticacion/seg-login/seg-login.component';
import { SegMenuprincipalComponent } from './Modulo-seguridad/Components/SEG-autenticacion/seg-menuprincipal/seg-menuprincipal.component';
import { SegPersonaActualizaComponent } from './Modulo-seguridad/Components/SEG-mantenimientos/SEG-personas/seg-persona-actualiza/seg-persona-actualiza.component';
import { SegPersonaNuevoComponent } from './Modulo-seguridad/Components/SEG-mantenimientos/SEG-personas/seg-persona-nuevo/seg-persona-nuevo.component';
import { SegPersonaListarComponent } from './Modulo-seguridad/Components/SEG-mantenimientos/SEG-personas/seg-persona-listar/seg-persona-listar.component';
import { SegModulosListarComponent } from './Modulo-seguridad/Components/SEG-mantenimientos/SEG-modulos/seg-modulos-listar/seg-modulos-listar.component';
import { SegModulosNuevoComponent } from './Modulo-seguridad/Components/SEG-mantenimientos/SEG-modulos/seg-modulos-nuevo/seg-modulos-nuevo.component';
import { SegModulosActualizaComponent } from './Modulo-seguridad/Components/SEG-mantenimientos/SEG-modulos/seg-modulos-actualiza/seg-modulos-actualiza.component';
import { SEGModulosDialogComponent } from './Modulo-seguridad/Components/SEG-mantenimientos/SEG-modulos/seg-modulos-dialog/seg-modulos-dialog.component';

import { SegPersonaDialogComponent } from './Modulo-seguridad/Components/SEG-mantenimientos/SEG-usuarios/seg-persona-dialog/seg-persona-dialog.component';
import { SegUsuarioListarComponent } from './Modulo-seguridad/Components/SEG-mantenimientos/SEG-usuarios/seg-usuario-listar/seg-usuario-listar.component';
import { SegUsuarioNuevoComponent } from './Modulo-seguridad/Components/SEG-mantenimientos/SEG-usuarios/seg-usuario-nuevo/seg-usuario-nuevo.component';
import { SegUsuarioActualizaComponent } from './Modulo-seguridad/Components/SEG-mantenimientos/SEG-usuarios/seg-usuario-actualiza/seg-usuario-actualiza.component';
import { SegPaginaPrincipalComponent } from './Modulo-seguridad/Components/SEG-autenticacion/seg-menuprincipal/seg-pagina-principal/seg-pagina-principal.component';
import { SegMenuitemComponent } from './Modulo-seguridad/Components/SEG-autenticacion/seg-menuitem/seg-menuitem.component';
import { SegCambiaclaveComponent } from './Modulo-seguridad/Components/SEG-autenticacion/seg-cambiaclave/seg-cambiaclave.component';
import { SegPerfilListarComponent } from './Modulo-seguridad/Components/SEG-mantenimientos/SEG-perfiles/seg-perfil-listar/seg-perfil-listar.component';
import { SegPerfilNuevoComponent } from './Modulo-seguridad/Components/SEG-mantenimientos/SEG-perfiles/seg-perfil-nuevo/seg-perfil-nuevo.component';
import { SegPerfilActualizaComponent } from './Modulo-seguridad/Components/SEG-mantenimientos/SEG-perfiles/seg-perfil-actualiza/seg-perfil-actualiza.component';
import { SegRestauraclaveComponent } from './Modulo-seguridad/Components/SEG-autenticacion/seg-restauraclave/seg-restauraclave.component';
// import { NgxChartsModule } from '@swimlane/ngx-charts';
// import { MatTableExporterModule } from 'mat-table-exporter';
// import { MatSelectFilterModule } from 'mat-select-filter';
import { SEGCargaEsperaComponent } from './Modulo-seguridad/Components/seg-carga-espera/seg-carga-espera.component';
import { SegUsuarioRolComponent } from './Modulo-seguridad/Components/SEG-mantenimientos/SEG-usuarios/seg-usuario-rol/seg-usuario-rol.component';
import { SegUsuarioRolDetalleDialogComponent } from './Modulo-seguridad/Components/SEG-mantenimientos/SEG-usuarios/seg-usuario-rol-detalle-dialog/seg-usuario-rol-detalle-dialog.component';
import { SegRegistrarseComponent } from './Modulo-seguridad/Components/SEG-autenticacion/seg-registrarse/seg-registrarse.component';
import { ClPerfilComponent } from './Modulo-cliente/Components/cl-perfil/cl-perfil.component';

import { ClCambiaperfilDialogComponent } from './Modulo-cliente/Components/cl-cambiaperfil-dialog/cl-cambiaperfil-dialog.component';
import { ClConfiguracionApiComponent } from './Modulo-cliente/Components/cl-configuracion-api/cl-configuracion-api.component';
import { ClInventarioComponent } from './Modulo-cliente/Components/cl-inventario/cl-inventario.component';
import { ClProveedoresComponent } from './Modulo-cliente/Components/cl-proveedores/cl-proveedores.component';
import { ClOrdenesDeCompraComponent } from './Modulo-cliente/Components/cl-ordenes-de-compra/cl-ordenes-de-compra.component';
import { ClOrdenesDeVentaComponent } from './Modulo-cliente/Components/cl-ordenes-de-venta/cl-ordenes-de-venta.component';
import { ClEnviosRecepcionComponent } from './Modulo-cliente/Components/cl-envios-recepcion/cl-envios-recepcion.component';
import { ClReportesComponent } from './Modulo-cliente/Components/cl-reportes/cl-reportes.component';
import { A11yModule } from "@angular/cdk/a11y";
import { MatFormFieldModule } from '@angular/material/form-field';
import { ClClientesComponent } from './Modulo-cliente/Components/cl-clientes/cl-clientes.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ClAddClientesComponent } from './Modulo-cliente/Components/cl-clientes/cl-add-clientes/cl-add-clientes.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AddInventarioComponent } from './Modulo-cliente/Components/cl-inventario/add-inventario/add-inventario.component';
import { AddProveedorComponent } from './Modulo-cliente/Components/cl-proveedores/add-proveedor/add-proveedor.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ClDashboardComponent } from './Modulo-cliente/Components/cl-dashboard/cl-dashboard.component';
import { EditarProveedorComponent } from './Modulo-cliente/Components/cl-proveedores/editar-proveedor/editar-proveedor.component';
import { ClEditarClienteComponent } from './Modulo-cliente/Components/cl-clientes/cl-editar-cliente/cl-editar-cliente.component';
import { EditarProductoComponent } from './Modulo-cliente/Components/cl-inventario/editar-producto/editar-producto.component';
import { ListarCompraComponent } from './Modulo-cliente/Components/cl-ordenes-de-compra/listar-compra/listar-compra.component';
import { AddCompraComponent } from './Modulo-cliente/Components/cl-ordenes-de-compra/add-compra/add-compra.component';
import { AddVentaComponent } from './Modulo-cliente/Components/cl-ordenes-de-venta/add-venta/add-venta.component';
import { ListarVentaComponent } from './Modulo-cliente/Components/cl-ordenes-de-venta/listar-venta/listar-venta.component';
@NgModule({
  declarations: [
    AppComponent,
    SegLoginComponent,
    SegMenuprincipalComponent,
    SegUsuarioListarComponent,
    SegUsuarioNuevoComponent,
    SegUsuarioActualizaComponent,
    SegPaginaPrincipalComponent,
    SegPersonaDialogComponent,
    SegRestauraclaveComponent,
    SegMenuitemComponent,
    SegCambiaclaveComponent,
    SegPerfilListarComponent,
    SegPerfilNuevoComponent,
    SegPerfilActualizaComponent,
    SegPersonaActualizaComponent,
    SegPersonaNuevoComponent,
    SegPersonaListarComponent,
    SegModulosListarComponent,
    SegModulosNuevoComponent,
    SegModulosActualizaComponent,
    SEGModulosDialogComponent,
    SEGCargaEsperaComponent,
    SegUsuarioRolComponent,
    SegUsuarioRolDetalleDialogComponent,
    SegRegistrarseComponent,
    ClPerfilComponent,
    ClCambiaperfilDialogComponent,
    ClConfiguracionApiComponent,
    ClInventarioComponent,
    ClProveedoresComponent,
    ClClientesComponent,
    ClOrdenesDeCompraComponent,
    ClOrdenesDeVentaComponent,
    ClEnviosRecepcionComponent,
    ClReportesComponent,
    ClAddClientesComponent,
    AddInventarioComponent,
    AddProveedorComponent,
    ClDashboardComponent,
    EditarProveedorComponent,
    ClEditarClienteComponent,
    EditarProductoComponent,
    ListarCompraComponent,
    AddCompraComponent,AddVentaComponent,
    ListarVentaComponent
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatToolbarModule,
    MatListModule,
    MatInputModule,
    MatDatepickerModule, //fecha
    MatNativeDateModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatDialogModule,
    CdkAccordionModule,
    MatTreeModule,
    MatCheckboxModule,
    MatTabsModule,
    MatRadioModule,
    FormsModule,
    // NgxChartsModule,
    MatAutocompleteModule,
    MatSortModule,
    A11yModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    NgxChartsModule
],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
