import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { usuarioRolDetDTO, usuarioRolDTO } from 'src/app/Modulo-seguridad/Models/seg-mantenimiento.model';
import { SegMantenimientosService } from 'src/app/Modulo-seguridad/Services/seg-mantenimientos.service';
import { GlobalsConstants } from 'src/assets/Model/globals-constants.model';
import swal from'sweetalert2';
import { SEGCargaEsperaComponent } from '../../../seg-carga-espera/seg-carga-espera.component';

@Component({
  selector: 'app-seg-usuario-rol-detalle-dialog',
  templateUrl: './seg-usuario-rol-detalle-dialog.component.html',
  styleUrls: ['./seg-usuario-rol-detalle-dialog.component.css']
})
export class SegUsuarioRolDetalleDialogComponent implements OnInit {

  constructor(private seguridadService: SegMantenimientosService,
    @Inject(MAT_DIALOG_DATA) public data:usuarioRolDTO,
    private dialog: MatDialog) { }
  
  listaRolDetalle : usuarioRolDetDTO[]=[]
  listaRolDetalleSel : usuarioRolDetDTO[]=[]
  rolDetalleSel : usuarioRolDetDTO= new usuarioRolDetDTO();
  globalConstants: GlobalsConstants = new GlobalsConstants();

  columnasMostrar=['descOpcion','sel'];
  dataSource!: MatTableDataSource<usuarioRolDetDTO>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  subscription!: Subscription;

  ngOnInit(): void {
    this.listaUsuarioRolDet();   
  }

  listaUsuarioRolDet(){
    const dialogRef = this.dialog.open(SEGCargaEsperaComponent, {
      disableClose:true,
      panelClass:'fondo-carga',
    });
    var idRol:number=this.data.idRol!;
    var idUsuarioRol:number=this.data.idUsuarioRol!;
    this.subscription = new Subscription();
    this.subscription = this.seguridadService.getUsuarioRolDet(idRol,idUsuarioRol)
    .subscribe((data :any) => {      
      this.listaRolDetalle=data;
      this.data.rolDetalle?.forEach((value:any)=>{
        const elementIndex = this.listaRolDetalle.findIndex((obj => obj.idUsuarioRolDet == value.idUsuarioRolDet));
        this.listaRolDetalle[elementIndex].sel = value.sel;
        this.listaRolDetalleSel.push(this.listaRolDetalle[elementIndex]);
      });
      this.dataSource = new MatTableDataSource(this.listaRolDetalle)
      this.dataSource.paginator = this.paginator;
      dialogRef.close();
    },
    (error) => {});  
  }

  filtro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selRol(event:any,listaRolSel:usuarioRolDetDTO){
    var check:boolean = event.target.checked;
    const elementIndex = this.listaRolDetalleSel.findIndex((obj => obj.idUsuarioRolDet == listaRolSel.idUsuarioRolDet));
    if (elementIndex <0)
    {
      this.rolDetalleSel= new usuarioRolDetDTO();
      this.rolDetalleSel.idUsuarioRolDet=listaRolSel.idUsuarioRolDet;
      this.rolDetalleSel.descOpcion=listaRolSel.descOpcion;
      this.rolDetalleSel.sel=check;
      this.listaRolDetalleSel.push(this.rolDetalleSel);
    }
    else
    {
      this.listaRolDetalleSel[elementIndex].sel = check;
    }
  }
  grabar(){
    // if(this.listaRolDetalleSel.length<1){
    //   swal.fire(this.globalConstants.msgErrorSummary, 'Debe seleccionar una opción' ,'warning'); 
    //   return;
    // };
    // this.dialogRef.close(this.listaRolDetalleSel);
  }
}
