import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { eliminarDTO, listaModuloDTO } from 'src/app/Modulo-seguridad/Models/seg-mantenimiento.model';
import { SegMantenimientosService } from 'src/app/Modulo-seguridad/Services/seg-mantenimientos.service';
import { GlobalsConstants } from 'src/assets/Model/globals-constants.model';
import swal from'sweetalert2';
import { ButtonAcces } from 'src/assets/Model/acceso-button.model';
import { StorageService } from 'src/app/Modulo-seguridad/Services/storage.service';
import { AccesoOpcionesService } from 'src/assets/Model/acceso-opciones.service';

@Component({
  selector: 'app-seg-modulos-listar',
  templateUrl: './seg-modulos-listar.component.html',
  styleUrls: ['./seg-modulos-listar.component.css']
})
export class SegModulosListarComponent implements OnInit {

  constructor(private moduloService: SegMantenimientosService,
    private router: Router,
    private storageService: StorageService,
    private accesoOpcionesService: AccesoOpcionesService
    ) { }
  
  buttonAcces: ButtonAcces = new ButtonAcces();
  modeloEliminar: eliminarDTO = new eliminarDTO();
  globalConstants: GlobalsConstants = new GlobalsConstants();
  subscription!: Subscription;

  listaModulo!: listaModuloDTO[] ;  
  columnasMostrar=['nombreModuloPadre','nombre','codigoAcceso','icono','url','numeroOrden','acciones'];
  dataSource!: MatTableDataSource<listaModuloDTO>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {    
    let idModulo: number =parseInt(this.storageService.getItemDecrypt('idModulo'));
    this.buttonAcces = this.accesoOpcionesService.getObtieneOpciones(idModulo);
    this.listar();
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  listar(){
    this.subscription = new Subscription();
    this.subscription = this.moduloService.getModulo()
    .subscribe((resp: listaModuloDTO[]) => {
      if (resp) {
          this.listaModulo = resp;
          this.dataSource = new MatTableDataSource(this.listaModulo)
          this.dataSource.paginator = this.paginator;
          //console.log(resp);
        }
      },
      (error) => console.error(error));
  };

    actualizarModulo(idModulo:number){
      //console.log('main/seg-modulo-actualiza/' + idModulo) ;
      this.router.navigate(['main/seg-modulo-actualiza/' + idModulo]);       
    }

    eliminarModulo(idModulo:number){
      this.modeloEliminar.id=idModulo;      
      swal.fire({
        title: this.globalConstants.subTitleEliminar,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: this.globalConstants.colorEliminar,
        confirmButtonText: this.globalConstants.titleEliminar,
        cancelButtonColor: this.globalConstants.colorCancelar,
        cancelButtonText:this.globalConstants.cCancelar        
      }).then((result) => {
        if (result.isConfirmed) {
          this.subscription = new Subscription();        
          this.subscription = this.moduloService.eliminaModulo(this.modeloEliminar)
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

  nuevoModulo() {
    this.router.navigate(['main/seg-modulo-nuevo']);
  }
}
