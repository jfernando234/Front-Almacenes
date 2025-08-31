import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { listaAccesoDTO, listaAccionDTO } from 'src/app/Modulo-seguridad/Models/seg-login.model';
import { StorageService } from 'src/app/Modulo-seguridad/Services/storage.service';
import { ButtonAcces } from './acceso-button.model';

@Injectable({
    providedIn: 'root'
  })
  export class AccesoOpcionesService {
  
    private buttonAcces: ButtonAcces = new ButtonAcces();
    private listOpcion: listaAccesoDTO[]=[];
    private listOpcionSelec: listaAccesoDTO[]=[];

    constructor(private storageService: StorageService) { }

    getObtieneOpciones(idModulo: number): ButtonAcces {
      this.buttonAcces = new ButtonAcces();
      this.listOpcion = [];
      if (this.storageService.getItem('opciones')) {        
        this.listOpcion = this.storageService.getItem('opciones');
        this.listOpcionSelec = this.listOpcion.filter(x => x.idModulo === idModulo && x.idModulo > 0);
        this.buttonAcces.btnNuevo = !this.listOpcionSelec[0].agregar;
        this.buttonAcces.btnEditar = !this.listOpcionSelec[0].modificar;
        this.buttonAcces.btnEliminar = !this.listOpcionSelec[0].eliminar;
        this.buttonAcces.btnVisualizar = !this.listOpcionSelec[0].imprimir;
        this.buttonAcces.btnEXCEL = !this.listOpcionSelec[0].descargarExcel;
        this.buttonAcces.btnPDF = !this.listOpcionSelec[0].descargarPDF;

      }
      return this.buttonAcces;
    }
  }
  