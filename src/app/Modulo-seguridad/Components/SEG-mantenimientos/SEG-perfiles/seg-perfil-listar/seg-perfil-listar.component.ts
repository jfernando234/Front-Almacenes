import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { eliminaPerfilDTO, listaPerfilDTO } from 'src/app/Modulo-seguridad/Models/seg-mantenimiento.model';
import { SegMantenimientosService } from 'src/app/Modulo-seguridad/Services/seg-mantenimientos.service';
import { StorageService } from 'src/app/Modulo-seguridad/Services/storage.service';
import { GlobalsConstants } from 'src/assets/Model/globals-constants.model';
import swal from'sweetalert2';

@Component({
  selector: 'app-seg-perfil-listar',
  templateUrl: './seg-perfil-listar.component.html',
  styleUrls: ['./seg-perfil-listar.component.css']
})
export class SegPerfilListarComponent implements OnInit {

  constructor(private seguridadService: SegMantenimientosService,
  private router: Router,
  private storageService: StorageService) { }
  
  globalConstants: GlobalsConstants = new GlobalsConstants();
  subscription!: Subscription;
  listaPerfil!: listaPerfilDTO[] ;
  modeloEliminar: eliminaPerfilDTO = new eliminaPerfilDTO();
  columnasMostrar=['nombrePerfil','descripcionPerfil','acciones'];
  dataSource!: MatTableDataSource<listaPerfilDTO>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.listarPerfil();
  }

  listarPerfil(){
    this.subscription = new Subscription();
    this.subscription = this.seguridadService.getPerfil()
    .subscribe((resp: listaPerfilDTO []) => {
      if (resp) {
          this.listaPerfil = resp;
          this.dataSource = new MatTableDataSource(this.listaPerfil)
          this.dataSource.paginator = this.paginator;
        }
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
  actualizaPerfil(idPerfil:number){
    this.router.navigate(['main/seg-perfil-actualiza/' + idPerfil]);
    }
  
  eliminaPerfil(perfil: any){
    this.modeloEliminar.id=perfil.idPerfil;
    swal.fire({
      title: this.globalConstants.subTitleEliminar,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.globalConstants.titleEliminar}).then((result) => {
      if (result.isConfirmed) {
        this.subscription = new Subscription();        
        this.subscription = this.seguridadService.eliminaPerfil(this.modeloEliminar)
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

  nuevoPerfil(){
    this.router.navigate(['main/seg-perfil-nuevo']);
  }

}
