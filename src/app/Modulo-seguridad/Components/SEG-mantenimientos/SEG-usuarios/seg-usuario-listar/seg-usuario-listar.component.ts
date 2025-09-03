import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { Route, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { SegMantenimientosService } from 'src/app/Modulo-seguridad/Services/seg-mantenimientos.service';
import { eliminaUsuarioDTO, grabaUsuarioDTO, listaUsuarioDTO } from 'src/app/Modulo-seguridad/Models/seg-mantenimiento.model';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import swal from'sweetalert2';
import { GlobalsConstants } from 'src/assets/Model/globals-constants.model';
import { StorageService } from 'src/app/Modulo-seguridad/Services/storage.service';
import { AccesoOpcionesService } from 'src/assets/Model/acceso-opciones.service';
import { ButtonAcces } from 'src/assets/Model/acceso-button.model';
import { SEGCargaEsperaComponent } from '../../../seg-carga-espera/seg-carga-espera.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-seg-usuario-listar',
  templateUrl: './seg-usuario-listar.component.html',
  styleUrls: ['./seg-usuario-listar.component.css']
})
export class SegUsuarioListarComponent implements OnInit {
  
  constructor(private usuariosService: SegMantenimientosService,
  private router: Router,
  private storageService: StorageService,
  private accesoOpcionesService: AccesoOpcionesService,
  private dialog: MatDialog) { }
  
  buttonAcces: ButtonAcces = new ButtonAcces();
  modeloEliminar: eliminaUsuarioDTO = new eliminaUsuarioDTO();
  globalConstants: GlobalsConstants = new GlobalsConstants();
  subscription!: Subscription;

  listaUsuario!: listaUsuarioDTO[] ;
  columnasMostrar=['Usuario','Nombres','Documento','Correo','roles','acciones'];
  dataSource!: MatTableDataSource<listaUsuarioDTO>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  ngOnInit(): void {
    let idModulo: number =parseInt(this.storageService.getItemDecrypt('idModulo'));
    this.buttonAcces = this.accesoOpcionesService.getObtieneOpciones(idModulo);
    //console.log(this.buttonAcces.btnNuevo);
    this.listarUsuario();
  }
  
  listarUsuario(){
    const dialogRef = this.dialog.open(SEGCargaEsperaComponent, {
      disableClose:true,
      panelClass:'fondo-carga',
    });
    this.subscription = new Subscription();
    this.subscription = this.usuariosService.getUsuario()
    .subscribe((resp: listaUsuarioDTO[]) => {
      if (resp) {
          this.listaUsuario = resp;
          this.dataSource = new MatTableDataSource(this.listaUsuario)
          this.dataSource.paginator = this.paginator;
      }
      dialogRef.close();
      },
      (error) => console.error(error));
  };
  
  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  actualizaUsuario(idUsuario:number){
    this.router.navigate(['main/seg-usuario-actualiza/' + idUsuario]);
  }
  rolesUsuario(idUsuario:number){
    this.router.navigate(['main/seg-usuario-rol/' + idUsuario]);
  }
  
  eliminaUsuario(usuario: any){
    this.modeloEliminar.id=usuario.idUsuario;
    this.modeloEliminar.idUsuarioLogin=this.storageService.getItemDecrypt('idUsuario');
    swal.fire({
      title: this.globalConstants.subTitleEliminar,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.globalConstants.titleEliminar}).then((result) => {
      if (result.isConfirmed) {
        this.subscription = new Subscription();        
        this.subscription = this.usuariosService.eliminaUsuario(this.modeloEliminar)
        .subscribe((mensaje : any) =>  {
        this.globalConstants.Mensaje=mensaje;
        if (this.globalConstants.Mensaje?.errorCodigo == 'OK'){
          swal.fire(this.globalConstants.msgExitoSummary, this.globalConstants.msgExitoDetail , 'success');
          window.location.reload();
        }
        else{
          swal.fire(this.globalConstants.msgErrorSummary, this.globalConstants.Mensaje?.errorMensaje , 'error');        
        }
         },
        (error) => {
        swal.fire(this.globalConstants.msgErrorSummary, error.error.errorMensaje ,'error');
      });
      }

    })
  }

  nuevoUsuario(){
    this.router.navigate(['main/registrarse']);
  }
}
