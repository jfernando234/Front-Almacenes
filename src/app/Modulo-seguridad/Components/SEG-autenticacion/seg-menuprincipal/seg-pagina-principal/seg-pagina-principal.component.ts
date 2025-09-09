import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { listarModuloDTO } from 'src/app/Modulo-seguridad/Models/seg-login.model';
import { SegMantenimientosService } from 'src/app/Modulo-seguridad/Services/seg-mantenimientos.service';
import { StorageService } from 'src/app/Modulo-seguridad/Services/storage.service';
import { DashboardDTO } from 'src/assets/Model/general.model';
import { curveCatmullRom } from 'd3-shape';

@Component({
  selector: 'app-seg-pagina-principal',
  templateUrl: './seg-pagina-principal.component.html',
  styleUrls: ['./seg-pagina-principal.component.css']
})
export class SegPaginaPrincipalComponent implements OnInit {
  modeloModuloNew:listarModuloDTO[]=[];
  dash_maestro:boolean=false;
  dash_compras:boolean=false;
  dash_almacen:boolean=false;
  dash_produccion:boolean=false;
  dash_rrhh:boolean=false;
  listaDashboard: DashboardDTO[]=[];
  listaDashboardTC:any[]=[]
  selectDashboardTC: any= new Object();
  subscription!: Subscription;  
  xAxisLabel= "name";
  yAxisLabel= "value";

  view: [number,number] = [900, 200];
  public curve = curveCatmullRom;

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  constructor(private storageService: StorageService,
    private usuariosService: SegMantenimientosService,
    ) { }

  ngOnInit(): void {
    this.modeloModuloNew=this.storageService.getItem('menu');    
  }
}

