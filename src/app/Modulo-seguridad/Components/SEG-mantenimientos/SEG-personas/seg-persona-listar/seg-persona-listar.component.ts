import { Component, OnInit, ViewChild } from '@angular/core';
import {  MatPaginator } from '@angular/material/paginator';
import {  MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { eliminaDTO, listaPersonaDTO } from 'src/app/Modulo-seguridad/Models/seg-mantenimiento.model';
import { SegMantenimientosService } from 'src/app/Modulo-seguridad/Services/seg-mantenimientos.service';
import { StorageService } from 'src/app/Modulo-seguridad/Services/storage.service';
import { ButtonAcces } from 'src/assets/Model/acceso-button.model';
import { AccesoOpcionesService } from 'src/assets/Model/acceso-opciones.service';
import { GlobalsConstants } from 'src/assets/Model/globals-constants.model';
import swal from'sweetalert2';

@Component({
  selector: 'app-seg-persona-listar',
  templateUrl: './seg-persona-listar.component.html',
  styleUrls: ['./seg-persona-listar.component.css']
})
export class SegPersonaListarComponent implements OnInit {

  constructor(private seguridadService: SegMantenimientosService,
    private router: Router,
    private storageService: StorageService,
    private accesoOpcionesService: AccesoOpcionesService) { }

    buttonAcces: ButtonAcces = new ButtonAcces();
    modeloEliminar: eliminaDTO = new eliminaDTO();
    globalConstants: GlobalsConstants = new GlobalsConstants();
    subscription!: Subscription;
    listaPersona!: listaPersonaDTO[] ;
    columnasMostrar=['numeroDocumento','apellidosyNombres','fechaNacimiento',
    'correo','acciones'];
    dataSource!: MatTableDataSource<listaPersonaDTO>;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    
    ngOnInit(): void {
      //this.buttonAcces = this.accesoOpcionesService.getObtieneOpciones(23);
      let idModulo: number =parseInt(this.storageService.getItemDecrypt('idModulo'));
      this.buttonAcces = this.accesoOpcionesService.getObtieneOpciones(idModulo);
      this.listarPersona();
  }

  listarPersona(){
    this.subscription = new Subscription();
    this.subscription = this.seguridadService.getPersona()
    .subscribe((resp: listaPersonaDTO[]) => {
      if (resp) {
          this.listaPersona = resp;
          this.dataSource = new MatTableDataSource(this.listaPersona)
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

  nuevaPersona(){
    this.router.navigate(['main/seg-persona-nuevo']);
  }
  actualizaPersona(idPersona:number){
    this.router.navigate(['main/seg-persona-actualiza/' + idPersona]);
  }
  eliminaPersona(idPersona:number){
    this.modeloEliminar.id=idPersona;
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
        this.subscription = this.seguridadService.eliminaPersona(this.modeloEliminar)
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

}
