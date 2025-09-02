import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { listarModuloDTO } from 'src/app/Modulo-seguridad/Models/seg-login.model';
import { StorageService } from 'src/app/Modulo-seguridad/Services/storage.service';
import { Subscription } from 'rxjs';
import { SegMantenimientosService } from 'src/app/Modulo-seguridad/Services/seg-mantenimientos.service';
import swal from'sweetalert2';
import { GlobalsConstants } from 'src/assets/Model/globals-constants.model';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { listaModuloDTO } from 'src/app/Modulo-seguridad/Models/seg-mantenimiento.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-seg-modulos-dialog',
  templateUrl: './seg-modulos-dialog.component.html',
  styleUrls: ['./seg-modulos-dialog.component.css']
})
export class SEGModulosDialogComponent implements OnInit {
  selectedModulo=0;
  form! : UntypedFormGroup;
  moduloPadre:listarModuloDTO[]=[];
  moduloHijo:listarModuloDTO[]=[];  
  listaMenu:listarModuloDTO[]=[];
  modeloModuloNew:listarModuloDTO[]=[];
  modeloModuloList:listarModuloDTO[]=[];
  modeloModulo:listarModuloDTO= new listarModuloDTO();

  treeControl = new NestedTreeControl<listarModuloDTO>(node => node.listarModuloDTO);
  dataSourceModuloTree = new MatTreeNestedDataSource<listarModuloDTO>();      
  globalConstants: GlobalsConstants = new GlobalsConstants();
  
  idModuloPadre:number=0
  nombreModulo:string=''      

  hasChild = (_: number, node: listarModuloDTO) => !!node.listarModuloDTO && node.listarModuloDTO.length > 0;  
  
  dataSource!: MatTableDataSource<listaModuloDTO>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  listaGrilla:listaModuloDTO[]=[];
  columnasMostrar=['selecciona','dependencia','nivel'];

  constructor(public dialogRef: MatDialogRef<SEGModulosDialogComponent>,
    private fb: UntypedFormBuilder,private router:Router,
    private seguridadService: SegMantenimientosService,
    private storageService: StorageService) { }

  subscription!: Subscription;
  
  ngOnInit(): void {    
    this.listarGrilla();    
  }

  listarGrilla(){    
    this.subscription = new Subscription();
    this.subscription = this.seguridadService.getModulo()
    .subscribe((res: listaModuloDTO[]) => {
      
      this.listaGrilla=res;
      this.dataSource = new MatTableDataSource(this.listaGrilla)
      this.dataSource.paginator = this.paginator;

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

  seleccionarRegistro(data:{}){
    this.dialogRef.close(data);
  };

  cancelar(){    
    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


}
