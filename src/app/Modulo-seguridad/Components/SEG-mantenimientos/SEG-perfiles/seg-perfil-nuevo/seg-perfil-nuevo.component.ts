import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { listaAccesoDTO, listaAccionDTO, listarModuloDTO } from 'src/app/Modulo-seguridad/Models/seg-login.model';
import { grabaPerfilDTO } from 'src/app/Modulo-seguridad/Models/seg-mantenimiento.model';
import { SegMantenimientosService } from 'src/app/Modulo-seguridad/Services/seg-mantenimientos.service';
import { StorageService } from 'src/app/Modulo-seguridad/Services/storage.service';
import { GlobalsConstants } from 'src/assets/Model/globals-constants.model';
import swal from'sweetalert2';

@Component({
  selector: 'app-seg-perfil-nuevo',
  templateUrl: './seg-perfil-nuevo.component.html',
  styleUrls: ['./seg-perfil-nuevo.component.css']
})

export class SegPerfilNuevoComponent implements OnInit {
  selectedModulo=0;
  form! : UntypedFormGroup;
  moduloControl: UntypedFormControl= new UntypedFormControl;

  moduloPadre:listarModuloDTO[]=[];
  moduloHijo:listarModuloDTO[]=[];
  listaMenu:listarModuloDTO[]=[];
  listaAcceso:listaAccesoDTO[]=[];
  listaAccesoGrabar:listaAccesoDTO[]=[];
  listaAccesoSel = new listaAccesoDTO();
  listaMenu_new:listarModuloDTO[]=[];
  accionListaDTO:listaAccionDTO[]=[];
  accionListaSeleccDTO:listaAccionDTO[]=[];

  modeloModuloNew:listarModuloDTO[]=[];
  modeloModuloList:listarModuloDTO[]=[];
  modeloModulo:listarModuloDTO= new listarModuloDTO();

  modeloGrabar:grabaPerfilDTO=new grabaPerfilDTO();

  treeControl = new NestedTreeControl<listarModuloDTO>(node => node.listarModuloDTO);
  dataSourceModuloTree = new MatTreeNestedDataSource<listarModuloDTO>();
  globalConstants: GlobalsConstants = new GlobalsConstants();
  
  nombreModulo:string=''


  hasChild = (_: number, node: listarModuloDTO) => !!node.listarModuloDTO && node.listarModuloDTO.length > 0;
  
  constructor(private fb: UntypedFormBuilder,private router:Router,
  private seguridadService: SegMantenimientosService,
  private storageService: StorageService) { }
  subscription!: Subscription;
  
  ngOnInit(): void {    
    this.listarModulos();
    this.instanciaForm();
  }

  listarModulos(){    
    this.subscription = new Subscription();
    this.subscription = this.seguridadService.getModulo()
    .subscribe((res: any) => {
      //console.log(res);
      this.setArmaMenuDimamico(res);
    },
      (error) => {
        swal.fire(this.globalConstants.msgErrorSummary, error.error.resultadoDescripcion, 'error');
      }
    );
  };

  setArmaMenuDimamico(modeloModuloList:listarModuloDTO[]) {
    this.modeloModuloNew = [];
    if (this.modeloModuloList) {
      let i = 0;
      do {
        if(modeloModuloList[i].idModuloPadre === 0 ){
          this.modeloModulo= modeloModuloList[i];
          if(modeloModuloList[i].esHijo == true){
            this.modeloModulo.listarModuloDTO = [];
            const modulo_padre=modeloModuloList[i].idModulo;
            this.setArmaMenuDimamicoHijo(this.modeloModulo,modulo_padre!,modeloModuloList);
          }
            this.modeloModuloNew.push(this.modeloModulo);
          }
          i++;
      } while (i < modeloModuloList.length);
    }
    this.listaMenu=this.modeloModuloNew;
    //console.log(this.listaMenu);
    this.moduloPadre= this.listaMenu.filter(x => x.idModuloPadre === 0);
    //console.log(this.moduloPadre);
  }
  setArmaMenuDimamicoHijo(modeloPadre:listarModuloDTO,modulo_padre: number,modeloModuloList:listarModuloDTO[]){
    if (modeloModuloList) {
      let i = 0;
      do {
        let modelo = new listarModuloDTO();
        if(modeloModuloList[i].idModuloPadre === modulo_padre){
          modelo= modeloModuloList[i];
          if(modeloModuloList[i].esHijo = true){
            modelo.listarModuloDTO = [];
            let modeloChildren = new listarModuloDTO();
            this.setArmaMenuDimamicoHijo(modelo,modeloModuloList[i].idModulo!,modeloModuloList);
          }
            modeloPadre.listarModuloDTO?.push(modelo);
          //}
        }
          i++;
      } while (i < modeloModuloList.length);
    }
  }

  listarModulosHijo(){
    var idModuloPadre:number
    this.moduloHijo= this.listaMenu.filter(x=> x.idModulo === this.selectedModulo);
    this.dataSourceModuloTree.data = this.moduloHijo[0].listarModuloDTO!;
  };

  instanciaForm(){
    this.form = this.fb.group({
      idPerfil:[0,{
        validators: [Validators.required]
      }],
      nombrePerfil:['',{
        validators: [Validators.required]
      }],
      descripcionPerfil:['',{
        validators: [Validators.required]
      }],    
    })
  }
  
  listarAccesos(modulo: any){
    this.nombreModulo=modulo.nombreModulo;
    let opciones=this.globalConstants.listaAcceso!;
    let opcionesLista=[];
    opciones={}
    opciones.idModulo=modulo.idModulo;
    opciones.accion='agregar';
    opciones.valor=true;
    opcionesLista.push(opciones!);
    opciones={}
    opciones.idModulo=modulo.idModulo;
    opciones.accion='consultar';
    opciones.valor=true;
    opcionesLista.push(opciones!);
    opciones={}
    opciones.idModulo=modulo.idModulo;
    opciones.accion='descargarExcel';
    opciones.valor=true;
    opcionesLista.push(opciones!);
    opciones={}
    opciones.idModulo=modulo.idModulo;
    opciones.accion='descargarPDF';
    opciones.valor=true;
    opcionesLista.push(opciones!);
    opciones={}
    opciones.idModulo=modulo.idModulo;
    opciones.accion='eliminar';
    opciones.valor=true;
    opcionesLista.push(opciones!);
    opciones={}
    opciones.idModulo=modulo.idModulo;
    opciones.accion='imprimir';
    opciones.valor=true;
    opcionesLista.push(opciones!);
    opciones={}
    opciones.idModulo=modulo.idModulo;
    opciones.accion='modificar';
    opciones.valor=true;
    opcionesLista.push(opciones!);
    this.accionListaDTO=opcionesLista.filter(x => x.accion !='idModulo');
  };

  seleccionaMenu(item: listaAccionDTO,index: number){
    item.nombreModulo=this.nombreModulo;
    let cant:number=this.accionListaSeleccDTO.filter(X => X.nombreModulo== item.nombreModulo && X.accion==item.accion).length;
    if (cant>0) {return;}
    this.accionListaSeleccDTO.push(item);
    this.accionListaDTO.splice(index,1);
  }

  deseleccionaOMenu(item: listaAccionDTO,index: number){  
    this.accionListaSeleccDTO.splice(index,1);
    let cant:number=this.accionListaDTO.filter(X => X.idModulo== item.idModulo && X.accion==item.accion).length;
    if(item.nombreModulo == this.nombreModulo && cant==0){
      this.accionListaDTO.push(item);
    }
    //
    
  }

  seleccionaTodo(){    
    let lista:listaAccionDTO;
    this.accionListaDTO.forEach((value, index) => {
      lista = new listaAccionDTO();
      value.nombreModulo=this.nombreModulo;
      this.accionListaSeleccDTO.push(value);
    });
    this.accionListaDTO=[]
  }
  deseleccionaTodo(){
    this.accionListaDTO.push(...this.accionListaSeleccDTO.filter(x => x.nombreModulo == this.nombreModulo));
    this.accionListaSeleccDTO=[]
  }
  grabar(){
    if(this.accionListaSeleccDTO.length == 0){
      swal.fire(this.globalConstants.msgErrorSummary, 'Debe seleccionar un módulo', 'warning');
      return;
    }
    this.listaAccesoGrabar=[];
    this.accionListaSeleccDTO.forEach((value,index)=>{
      if (this.listaAccesoSel.idModulo !== value.idModulo){
        this.listaAccesoSel = new listaAccesoDTO();
        this.listaAccesoSel.idModulo=value.idModulo;
        this.listaAccesoSel.agregar=false;
        this.listaAccesoSel.consultar=false;
        this.listaAccesoSel.descargarExcel=false;
        this.listaAccesoSel.descargarPDF=false;
        this.listaAccesoSel.eliminar=false;
        this.listaAccesoSel.imprimir=false;
        this.listaAccesoSel.modificar=false;
        this.listaAccesoGrabar.push(this.listaAccesoSel)
      }
      if (value.accion == "agregar") {this.listaAccesoSel.agregar=value.valor};
      if (value.accion == "consultar") {this.listaAccesoSel.consultar=value.valor}
      if (value.accion == "descargarExcel") {this.listaAccesoSel.descargarExcel=value.valor}
      if (value.accion == "descargarPDF") {this.listaAccesoSel.descargarPDF=value.valor}
      if (value.accion == "eliminar") {this.listaAccesoSel.eliminar=value.valor}
      if (value.accion == "imprimir") {this.listaAccesoSel.imprimir=value.valor}
      if (value.accion == "modificar") {this.listaAccesoSel.modificar=value.valor}    
    });
    this.modeloGrabar=this.form.value;
    this.modeloGrabar.listaPerfilModulo=this.listaAccesoGrabar;

      this.subscription = new Subscription();
      this.subscription = this.seguridadService.crearPerfil(this.modeloGrabar)
      .subscribe((mensaje : any) =>  {
      this.globalConstants.Mensaje=mensaje;
      if (this.globalConstants.Mensaje?.errorCodigo == 'OK'){
        swal.fire(this.globalConstants.msgExitoSummary, this.globalConstants.msgExitoDetail , 'success');
        this.router.navigate(['main/seg-perfil']);
      }
      else{
        swal.fire(this.globalConstants.msgErrorSummary, this.globalConstants.Mensaje?.errorMensaje , 'warning');
      }
       },
      (error) => {
      swal.fire(this.globalConstants.msgErrorSummary, error.error.errorMensaje ,'error');
    });

  }

  cancelar(){
    this.router.navigate(['main/seg-perfil']);
  }
}
