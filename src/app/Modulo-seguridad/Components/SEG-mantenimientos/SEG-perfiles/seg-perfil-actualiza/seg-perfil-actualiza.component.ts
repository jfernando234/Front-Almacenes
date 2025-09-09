import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { actualizaAccesoDTO, eliminaAccesoDTO, grabaAccesoDTO, listaAccesoDTO, listaAccionDTO, listarModuloDTO } from 'src/app/Modulo-seguridad/Models/seg-login.model';
import { actualizaPerfilDTO, grabaPerfilDTO } from 'src/app/Modulo-seguridad/Models/seg-mantenimiento.model';
import { SegMantenimientosService } from 'src/app/Modulo-seguridad/Services/seg-mantenimientos.service';
import { StorageService } from 'src/app/Modulo-seguridad/Services/storage.service';
import { GlobalsConstants } from 'src/assets/Model/globals-constants.model';
import swal from'sweetalert2';

@Component({
  selector: 'app-seg-perfil-actualiza',
  templateUrl: './seg-perfil-actualiza.component.html',
  styleUrls: ['./seg-perfil-actualiza.component.css']
})
export class SegPerfilActualizaComponent implements OnInit {
  selectedModulo=0;
  form! : FormGroup;
  moduloControl: FormControl= new FormControl;

  moduloPadre:listarModuloDTO[]=[];
  moduloHijo:listarModuloDTO[]=[];
  listaMenu:listarModuloDTO[]=[];
  listaAcceso:listaAccesoDTO[]=[];
  listaAccesoSel = new listaAccesoDTO();
  accionListaDTO:listaAccionDTO[]=[];
  accionListaSeleccDTO:listaAccionDTO[]=[];

  modeloModuloNew:listarModuloDTO[]=[];
  modeloModuloList:listarModuloDTO[]=[];
  modeloModulo:listarModuloDTO= new listarModuloDTO();

  modeloGrabar:actualizaPerfilDTO=new actualizaPerfilDTO();
  modeloGrabaModulo!: grabaAccesoDTO;
  modeloEliminaModulo!: eliminaAccesoDTO;
  modeloActualizar:actualizaAccesoDTO=new actualizaAccesoDTO();

  treeControl = new NestedTreeControl<listarModuloDTO>(node => node.listarModuloDTO);
  dataSourceModuloTree = new MatTreeNestedDataSource<listarModuloDTO>();
  globalConstants: GlobalsConstants = new GlobalsConstants();
  
  nombreModulo:string=''

  idPerfil: number=0;
  subscription!: Subscription;

  hasChild = (_: number, node: listarModuloDTO) => !!node.listarModuloDTO && node.listarModuloDTO.length > 0;

  constructor(private fb: FormBuilder,private router:Router,
    private readonly route: ActivatedRoute,
    private seguridadService: SegMantenimientosService,
    private storageService: StorageService) { }

  ngOnInit(): void {
    this.listarModulos();
    this.instanciaForm();
    this.route.params.subscribe((params: Params) => {
    this.idPerfil = params.idPerfil;
    this.listaPerfilID();
    this.listarModulosPerfil();
    });
  }
  listaPerfilID(){
    this.subscription = new Subscription();
    this.subscription = this.seguridadService.getPerfilID(this.idPerfil)
    .subscribe((data :any) => {
      this.form.patchValue(data);
    },
    (error) => {
    });
    
  }
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
  listarModulos(){    
      this.subscription = new Subscription();
      this.subscription = this.seguridadService.getModulo()
    .subscribe((res: any) => {
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
      this.moduloPadre= this.listaMenu.filter(x => x.idModuloPadre === 0);
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

    listarModulosPerfil(){      
      this.subscription = new Subscription();
      this.subscription = this.seguridadService.getPerfilModuloID(this.idPerfil!)      
      .subscribe((resp:listaAccionDTO[]) => {      
      if (resp) {
        this.listaAcceso = resp;
        //console.log(resp);
        let lista:listaAccionDTO;
        let opcionesLista:listaAccionDTO[]=[];
        this.listaAcceso.forEach((value, index) => {
          this.listarAccesosPerfil(value);
        });        
        this.accionListaSeleccDTO=this.accionListaDTO.filter(x => x.accion !='idModulo' && x.valor ==true);
        this.accionListaDTO=[];
        }
      },
      (error) => console.error(error));      
    };
    listarAccesosPerfil(moduloAcceso:any){      
      let opciones=new listaAccionDTO()
      opciones.nombreModulo=moduloAcceso.nombreModulo;
      opciones.idPerfilModulo=moduloAcceso.idPerfilModulo;
      opciones.idModulo=moduloAcceso.idModulo;
      opciones.accion='agregar';
      opciones.valor=moduloAcceso.agregar;
      this.accionListaDTO.push(opciones!);
      opciones=new listaAccionDTO()
      opciones.idPerfilModulo=moduloAcceso.idPerfilModulo;
      opciones.nombreModulo=moduloAcceso.nombreModulo;
      opciones.idModulo=moduloAcceso.idModulo;
      opciones.accion='consultar';
      opciones.valor=moduloAcceso.consultar;
      this.accionListaDTO.push(opciones!);
      opciones=new listaAccionDTO()
      opciones.idPerfilModulo=moduloAcceso.idPerfilModulo;
      opciones.nombreModulo=moduloAcceso.nombreModulo;
      opciones.idModulo=moduloAcceso.idModulo;
      opciones.accion='descargarExcel';
      opciones.valor=moduloAcceso.descargarExcel;
      this.accionListaDTO.push(opciones!);
      opciones=new listaAccionDTO()
      opciones.idPerfilModulo=moduloAcceso.idPerfilModulo;
      opciones.nombreModulo=moduloAcceso.nombreModulo;
      opciones.idModulo=moduloAcceso.idModulo;
      opciones.accion='descargarPDF';
      opciones.valor=moduloAcceso.descargarPDF;
      this.accionListaDTO.push(opciones!);
      opciones=new listaAccionDTO()
      opciones.idPerfilModulo=moduloAcceso.idPerfilModulo;
      opciones.nombreModulo=moduloAcceso.nombreModulo;
      opciones.idModulo=moduloAcceso.idModulo;
      opciones.accion='eliminar';
      opciones.valor=moduloAcceso.eliminar;
      this.accionListaDTO.push(opciones!);
      opciones=new listaAccionDTO()
      opciones.idPerfilModulo=moduloAcceso.idPerfilModulo;
      opciones.nombreModulo=moduloAcceso.nombreModulo;
      opciones.idModulo=moduloAcceso.idModulo;
      opciones.accion='imprimir';
      opciones.valor=moduloAcceso.imprimir;
      this.accionListaDTO.push(opciones!);
      opciones=new listaAccionDTO()
      opciones.idPerfilModulo=moduloAcceso.idPerfilModulo;
      opciones.nombreModulo=moduloAcceso.nombreModulo;
      opciones.idModulo=moduloAcceso.idModulo;
      opciones.accion='modificar';
      opciones.valor=moduloAcceso.modificar;
      this.accionListaDTO.push(opciones!);
    };

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
    //console.log(item);
    
    item.nombreModulo=this.nombreModulo;
    let cant:number=this.accionListaSeleccDTO.filter(X => X.nombreModulo== item.nombreModulo && X.accion==item.accion).length;
    if (cant>0) {return;}
    this.accionListaSeleccDTO.push(item);
    this.accionListaDTO.splice(index,1);
    this.modeloActualizar = new listaAccesoDTO();
    this.modeloActualizar.idModulo=item.idModulo;
    this.modeloActualizar.agregar=false;
    this.modeloActualizar.consultar=false;
    this.modeloActualizar.descargarExcel=false;
    this.modeloActualizar.descargarPDF=false;
    this.modeloActualizar.eliminar=false;
    this.modeloActualizar.imprimir=false;
    this.modeloActualizar.modificar=false;    
    this.accionListaSeleccDTO.forEach((value,index)=>{
      if (item.idModulo === value.idModulo){
        if (value.accion == "agregar") {this.modeloActualizar.agregar=value.valor};
        if (value.accion == "consultar") {this.modeloActualizar.consultar=value.valor}
        if (value.accion == "descargarExcel") {this.modeloActualizar.descargarExcel=value.valor}
        if (value.accion == "descargarPDF") {this.modeloActualizar.descargarPDF=value.valor}
        if (value.accion == "eliminar") {this.modeloActualizar.eliminar=value.valor}
        if (value.accion == "imprimir") {this.modeloActualizar.imprimir=value.valor}
        if (value.accion == "modificar") {this.modeloActualizar.modificar=value.valor}    
      }
    });
    this.modeloActualizar.idPerfil=this.idPerfil;
    this.modeloActualizar.idPerfilModulo=item.idPerfilModulo;
    //console.log(this.modeloActualizar);
    //return;
    this.actualizaPerfilModulo();
  }

  grabarPerfilModulo(){

  }

  deseleccionaOMenu(item: listaAccionDTO,index: number){  
    this.accionListaSeleccDTO.splice(index,1);
    let cant:number=this.accionListaDTO.filter(X => X.idModulo== item.idModulo && X.accion==item.accion).length;    
    if(item.nombreModulo == this.nombreModulo && cant==0){
      this.accionListaDTO.push(item);
    }

    this.modeloActualizar = new listaAccesoDTO();
    this.modeloActualizar.idModulo=item.idModulo;
    this.modeloActualizar.agregar=false;
    this.modeloActualizar.consultar=false;
    this.modeloActualizar.descargarExcel=false;
    this.modeloActualizar.descargarPDF=false;
    this.modeloActualizar.eliminar=false;
    this.modeloActualizar.imprimir=false;
    this.modeloActualizar.modificar=false;    

    this.accionListaSeleccDTO.forEach((value,index)=>{
      if (item.idPerfilModulo === value.idPerfilModulo){
        if (value.accion == "agregar") {this.modeloActualizar.agregar=value.valor};
        if (value.accion == "consultar") {this.modeloActualizar.consultar=value.valor}
        if (value.accion == "descargarExcel") {this.modeloActualizar.descargarExcel=value.valor}
        if (value.accion == "descargarPDF") {this.modeloActualizar.descargarPDF=value.valor}
        if (value.accion == "eliminar") {this.modeloActualizar.eliminar=value.valor}
        if (value.accion == "imprimir") {this.modeloActualizar.imprimir=value.valor}
        if (value.accion == "modificar") {this.modeloActualizar.modificar=value.valor}    
      }
    });
    this.modeloActualizar.idPerfil=this.idPerfil;
    this.modeloActualizar.idPerfilModulo=item.idPerfilModulo;
    this.actualizaPerfilModulo();

    }

  seleccionaTodo(){    
    /*let lista:listaAccionDTO;
    this.accionListaDTO.forEach((value, index) => {
      lista = new listaAccionDTO();
      value.nombreModulo=this.nombreModulo;
      this.accionListaSeleccDTO.push(value);
    });
    this.accionListaDTO=[]*/
  }
  deseleccionaTodo(){
    /*this.accionListaDTO.push(...this.accionListaSeleccDTO.filter(x => x.nombreModulo == this.nombreModulo));
    this.accionListaSeleccDTO=[]*/
  }

  actualizaPerfilModulo(){
    this.subscription = new Subscription();
    //console.log(this.modeloActualizar);
      this.subscription = this.seguridadService.actualizaPerfilModulo(this.modeloActualizar)
      .subscribe((mensaje : any) =>  {
      this.globalConstants.Mensaje=mensaje;
       },
      (error) => {
      swal.fire(this.globalConstants.msgErrorSummary, error.error.errorMensaje ,'error');
    });
  }

  grabar(){
    this.modeloGrabar=this.form.value;
    this.subscription = new Subscription();
      this.subscription = this.seguridadService.actualizaPerfil(this.modeloGrabar)
      .subscribe((mensaje : any) => {
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
