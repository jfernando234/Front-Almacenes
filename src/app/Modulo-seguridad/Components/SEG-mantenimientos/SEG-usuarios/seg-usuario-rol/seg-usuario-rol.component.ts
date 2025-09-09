import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { usuarioRolDetDTO, usuarioRolDTO } from 'src/app/Modulo-seguridad/Models/seg-mantenimiento.model';
import { SegMantenimientosService } from 'src/app/Modulo-seguridad/Services/seg-mantenimientos.service';
import { GlobalsConstants } from 'src/assets/Model/globals-constants.model';
import { SegUsuarioRolDetalleDialogComponent } from '../seg-usuario-rol-detalle-dialog/seg-usuario-rol-detalle-dialog.component';
import swal from'sweetalert2';
import { SEGCargaEsperaComponent } from '../../../seg-carga-espera/seg-carga-espera.component';

@Component({
  selector: 'app-seg-usuario-rol',
  templateUrl: './seg-usuario-rol.component.html',
  styleUrls: ['./seg-usuario-rol.component.css']
})
export class SegUsuarioRolComponent implements OnInit {
  form! : FormGroup;
  idUsuario: number=0;
  subscription!: Subscription;
  listaRolUsuario: usuarioRolDTO[]=[];
  listaRolUsuarioSel: usuarioRolDTO[]=[];
  listaRolUsuarioDet: usuarioRolDetDTO[]=[];
  globalConstants: GlobalsConstants = new GlobalsConstants();
  
  columnasMostrar=['descPerfil','nombreModulo','nombreRol','descripRol','sel','ver'];
  dataSource!: MatTableDataSource<usuarioRolDTO>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  

  constructor(private router: Router,
    private fb:FormBuilder,
    private readonly route: ActivatedRoute,
    private seguridadService: SegMantenimientosService,
    private dialog: MatDialog,) { }

  ngOnInit(): void {
    this.instanciaForm();

    this.route.params.subscribe((params: Params) => {
      this.idUsuario = params.idUsuario;
      this.listaUsuarioID();
      this.listaUsuarioRolID();
    });
  }
  listaUsuarioID(){
    this.subscription = new Subscription();
    this.subscription = this.seguridadService.getUsuarioID(this.idUsuario)
    .subscribe((data :any) => {
      this.form.patchValue(data);
    },
    (error) => {
    });
    
  }
  listaUsuarioRolID(){
    const dialogRef = this.dialog.open(SEGCargaEsperaComponent, {
      disableClose:true,
      panelClass:'fondo-carga',
    });
    this.subscription = new Subscription();
    this.subscription = this.seguridadService.getUsuarioRol(this.idUsuario)
    .subscribe((data :any) => {
      this.listaRolUsuario=data;
      //console.log(this.listaRolUsuario);
      this.dataSource = new MatTableDataSource(this.listaRolUsuario)
      this.dataSource.paginator = this.paginator;
      dialogRef.close();
    },
    (error) => {});  
  }
  instanciaForm(){
    this.form = this.fb.group({
      idPersona:[0,{
        validators: [Validators.required]
      }],
      primerApellido:['',{
        validators: [Validators.required]
      }],
      segundoApellido:['',{
        validators: [Validators.required]
      }],
      nombres:['',{
        validators: [Validators.required]
      }],
      numeroDocumento:['',{
        validators: [Validators.required]
      }],
      correoInstitucional:['',{
        validators: [Validators.required]
      }],
      login:'',
      apellidosyNombres:'',
    })
  }
  verDetalle(listaRolSel:usuarioRolDTO,index:number){
    this.actualizaCheck(listaRolSel,index)
    //console.log(listaRolSel);
    //console.log(this.listaRolUsuarioSel);
    index = this.listaRolUsuarioSel.findIndex((obj => obj.idRolModulo == listaRolSel.idRolModulo && obj.idUsuarioPerfil == listaRolSel.idUsuarioPerfil));
    //console.log(this.listaRolUsuarioSel[index]);
    //return;
    const dialogRef = this.dialog.open(SegUsuarioRolDetalleDialogComponent, {
      width: '60%',
      disableClose:true,
      data:this.listaRolUsuarioSel[index],
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data){
        this.listaRolUsuarioDet=[]
        //this.listaRolUsuarioDet=data;
        this.listaRolUsuarioSel[index].rolDetalle=[];
        data.forEach((value:usuarioRolDTO)=> {
          this.listaRolUsuarioDet.push(value);
        });
        this.listaRolUsuarioSel[index].rolDetalle=this.listaRolUsuarioDet;
        if (this.listaRolUsuarioDet.length <1){listaRolSel.sel=false ;return;}
        this.grabar();
      }
      else{this.ngOnInit();}
    });
    //this.grabar();
  }
  
  actualizaCheck(listaRolSel:usuarioRolDTO,index:number){
    const elementIndex = this.listaRolUsuarioSel.findIndex((obj => obj.idRolModulo == listaRolSel.idRolModulo && obj.idUsuarioPerfil == listaRolSel.idUsuarioPerfil));
    if (elementIndex <0)
    {
      listaRolSel.sel=listaRolSel.sel;
      this.listaRolUsuarioSel.push(listaRolSel);
      const elementIndex = this.listaRolUsuarioSel.findIndex((obj => obj.idRolModulo == listaRolSel.idRolModulo && obj.idUsuarioPerfil == listaRolSel.idUsuarioPerfil));
      index=elementIndex;
    }
    else
    {
      this.listaRolUsuarioSel[elementIndex].sel = listaRolSel.sel;
      index=elementIndex;
    }
  }

  selRol(event:any,listaRolSel:usuarioRolDTO){
    var check:boolean = event.target.checked;
    const elementIndex = this.listaRolUsuario.findIndex((obj => obj.idRolModulo == listaRolSel.idRolModulo && obj.idUsuarioPerfil == listaRolSel.idUsuarioPerfil));   
    this.listaRolUsuario[elementIndex].sel = check;
    
    if (check == true && listaRolSel.tiene_detalle== true)
    {
      this.verDetalle(listaRolSel,elementIndex)
    }
    else
    {
      this.actualizaCheck(listaRolSel,elementIndex)
      this.grabar();
    }
  }

  grabar(){
    console.log(this.listaRolUsuarioSel);
    //return;
    this.subscription = new Subscription();
      this.subscription = this.seguridadService.crearRolUsuario(this.listaRolUsuarioSel)
      .subscribe((mensaje : any) =>  {
      this.globalConstants.Mensaje=mensaje;
      
      if (this.globalConstants.Mensaje?.errorCodigo == 'OK'){
        swal.fire(this.globalConstants.msgExitoSummary, this.globalConstants.msgExitoDetail , 'success');
        window.location.reload();
        //this.router.navigate(['main/seg-usuario']);
      }
      else{
        swal.fire(this.globalConstants.msgErrorSummary, this.globalConstants.Mensaje?.errorMensaje , 'warning');
      }
       },
      (error: { error: { errorMensaje: string | undefined; }; }) => {
      swal.fire(this.globalConstants.msgErrorSummary, error.error.errorMensaje ,'error');
      });

  }
  cancelar(){
    this.router.navigate(['/main/seg-usuario']);
  }
  
}
