import { Component, OnInit, ViewChild } from '@angular/core';
import {  MatDialogRef } from '@angular/material/dialog';
import {  MatPaginator } from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { Subscription } from 'rxjs';
import { listaPersonaDTO } from 'src/app/Modulo-seguridad/Models/seg-mantenimiento.model';
import { SegMantenimientosService } from 'src/app/Modulo-seguridad/Services/seg-mantenimientos.service';
import { StorageService } from 'src/app/Modulo-seguridad/Services/storage.service';

@Component({
  selector: 'app-seg-persona-dialog',
  templateUrl: './seg-persona-dialog.component.html',
  styleUrls: ['./seg-persona-dialog.component.css']
})

export class SegPersonaDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SegPersonaDialogComponent>,
    private storageService: StorageService,
    private seguridadService: SegMantenimientosService) { }

  listaPersona!: listaPersonaDTO[] ;
  columnasMostrar=['selecciona','Nombres','Documento','Correo'];
  dataSource!: MatTableDataSource<listaPersonaDTO>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  subscription!: Subscription;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.listarPersona();
    //this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    //console.log(this.dataSource);
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
  seleccionaPersona(data:{}){
    this.dialogRef.close(data);
  };

} 
