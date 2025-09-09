import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { SegCambiaclaveComponent } from './Modulo-seguridad/Components/SEG-autenticacion/seg-cambiaclave/seg-cambiaclave.component';
import { SegLoginComponent } from './Modulo-seguridad/Components/SEG-autenticacion/seg-login/seg-login.component';
import { SegMenuprincipalComponent } from './Modulo-seguridad/Components/SEG-autenticacion/seg-menuprincipal/seg-menuprincipal.component';
import { SegPaginaPrincipalComponent } from './Modulo-seguridad/Components/SEG-autenticacion/seg-menuprincipal/seg-pagina-principal/seg-pagina-principal.component';
import { SegRestauraclaveComponent } from './Modulo-seguridad/Components/SEG-autenticacion/seg-restauraclave/seg-restauraclave.component';
import { SegModulosActualizaComponent } from './Modulo-seguridad/Components/SEG-mantenimientos/SEG-modulos/seg-modulos-actualiza/seg-modulos-actualiza.component';
import { SegModulosListarComponent } from './Modulo-seguridad/Components/SEG-mantenimientos/SEG-modulos/seg-modulos-listar/seg-modulos-listar.component';
import { SegModulosNuevoComponent } from './Modulo-seguridad/Components/SEG-mantenimientos/SEG-modulos/seg-modulos-nuevo/seg-modulos-nuevo.component';
import { SegPerfilActualizaComponent } from './Modulo-seguridad/Components/SEG-mantenimientos/SEG-perfiles/seg-perfil-actualiza/seg-perfil-actualiza.component';
import { SegPerfilListarComponent } from './Modulo-seguridad/Components/SEG-mantenimientos/SEG-perfiles/seg-perfil-listar/seg-perfil-listar.component';
import { SegPerfilNuevoComponent } from './Modulo-seguridad/Components/SEG-mantenimientos/SEG-perfiles/seg-perfil-nuevo/seg-perfil-nuevo.component';
import { SegPersonaActualizaComponent } from './Modulo-seguridad/Components/SEG-mantenimientos/SEG-personas/seg-persona-actualiza/seg-persona-actualiza.component';
import { SegPersonaListarComponent } from './Modulo-seguridad/Components/SEG-mantenimientos/SEG-personas/seg-persona-listar/seg-persona-listar.component';
import { SegPersonaNuevoComponent } from './Modulo-seguridad/Components/SEG-mantenimientos/SEG-personas/seg-persona-nuevo/seg-persona-nuevo.component';
import { SegUsuarioActualizaComponent } from './Modulo-seguridad/Components/SEG-mantenimientos/SEG-usuarios/seg-usuario-actualiza/seg-usuario-actualiza.component';
import { SegUsuarioListarComponent } from './Modulo-seguridad/Components/SEG-mantenimientos/SEG-usuarios/seg-usuario-listar/seg-usuario-listar.component';
import { SegUsuarioNuevoComponent } from './Modulo-seguridad/Components/SEG-mantenimientos/SEG-usuarios/seg-usuario-nuevo/seg-usuario-nuevo.component';
import { SegUsuarioRolComponent } from './Modulo-seguridad/Components/SEG-mantenimientos/SEG-usuarios/seg-usuario-rol/seg-usuario-rol.component';
import { SegRegistrarseComponent } from './Modulo-seguridad/Components/SEG-autenticacion/seg-registrarse/seg-registrarse.component';
import { ClPerfilComponent } from './Modulo-cliente/Components/cl-perfil/cl-perfil.component';
import { ClConfiguracionApiComponent } from './Modulo-cliente/Components/cl-configuracion-api/cl-configuracion-api.component';
import { ClDashboardComponent } from './Modulo-cliente/Components/cl-dashboard/cl-dashboard.component';
const routes: Routes = [  
  { path: 'login', component: SegLoginComponent },
  { path: 'restaura-clave', component: SegRestauraclaveComponent},
  { path: 'registrarse', component: SegRegistrarseComponent},
  { path: 'cambia-clavenueva', component: SegCambiaclaveComponent},
  { path: 'main', component: SegMenuprincipalComponent,
  children: [
    { path: 'principal', component: SegPaginaPrincipalComponent, canActivate: [AuthGuard] },
    { path: 'seg-usuario', component: SegUsuarioListarComponent, canActivate: [AuthGuard]},
    { path: 'seg-usuario-nuevo', component: SegUsuarioNuevoComponent, canActivate: [AuthGuard] },
    { path: 'seg-usuario-actualiza/:idUsuario', component: SegUsuarioActualizaComponent, canActivate: [AuthGuard]},
    { path: 'seg-usuario-rol/:idUsuario', component: SegUsuarioRolComponent, canActivate: [AuthGuard]},
    { path: 'cambia-clave', component: SegCambiaclaveComponent, canActivate: [AuthGuard] },
    { path: 'seg-perfil', component: SegPerfilListarComponent, canActivate: [AuthGuard]},
    { path: 'seg-perfil-nuevo', component: SegPerfilNuevoComponent, canActivate: [AuthGuard]},
    { path: 'seg-perfil-actualiza/:idPerfil', component: SegPerfilActualizaComponent, canActivate: [AuthGuard]},
    { path: 'seg-persona', component: SegPersonaListarComponent, canActivate: [AuthGuard]},
    { path: 'seg-persona-nuevo', component: SegPersonaNuevoComponent, canActivate: [AuthGuard] },
    { path: 'seg-persona-actualiza/:idPersona', component: SegPersonaActualizaComponent, canActivate: [AuthGuard]},
    { path: 'seg-modulo', component: SegModulosListarComponent, canActivate: [AuthGuard]},
    { path: 'seg-modulo-nuevo', component: SegModulosNuevoComponent, canActivate: [AuthGuard]},
    { path: 'seg-modulo-actualiza/:idModulo', component: SegModulosActualizaComponent, canActivate: [AuthGuard]},
    {path: 'cl-perfil',component:ClPerfilComponent,canActivate:[AuthGuard]},
    {path: 'cl-configuracion-api',component:ClConfiguracionApiComponent,canActivate:[AuthGuard]},
    {path: 'cl-dashboard',component:ClDashboardComponent,canActivate:[AuthGuard]},
    {path: 'registrarse',component:SegRegistrarseComponent,canActivate:[AuthGuard]},
  ]},
  { path: '', redirectTo:'login', pathMatch : 'full'},];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
