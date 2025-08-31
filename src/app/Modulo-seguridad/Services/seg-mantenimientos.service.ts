import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardDTO } from 'src/assets/Model/general.model';
import { environment } from 'src/environments/environment';
import { actualizaAccesoDTO, eliminaAccesoDTO, listaAccionDTO, listarModuloDTO } from '../Models/seg-login.model';
import { actualizaPerfilDTO, agregaUsuarioPerfilDTO, eliminaDTO, eliminaPerfilDTO, eliminarDTO, eliminaUsuarioDTO, eliminaUsuarioPerfilDTO, grabaPerfilDTO, grabaPersonaDTO, grabarModuloDTO, grabaTCambioDTO, grabaUsuarioDTO, listaModuloDTO, listaPerfilDTO, listaPersonaDTO, listaTCambioDTO, listaUsuarioDTO, modificaPersonaDTO, usuarioRolDTO } from '../Models/seg-mantenimiento.model';
import { UserContextService } from './user-context.service';

@Injectable({
  providedIn: 'root'
})
export class SegMantenimientosService {
  ip:string=''; 
  
  modeloGrabar: eliminaUsuarioDTO = new eliminaUsuarioDTO();
  constructor(private http: HttpClient, 
    private userContextService: UserContextService) { }

  
  
  getIPAddress()
  {
    this.http.get("http://api.ipify.org/?format=json").subscribe((res:any)=>{
      //console.log(res.ip);
      this.ip = res.ip;
    });

  }

  private apiURL_Usuario = environment.url_api + 'Usuario';
  private apiURL_Perfil = environment.url_api + 'Perfil';
  private apiURL_PerfilModulo = environment.url_api +'PerfilModulo';
  private apiURL_PerfilUsuario = environment.url_api + 'UsuarioPerfil';
  private apiURL_Modulo = environment.url_api + 'Modulo';
  private apiURL_Persona = environment.url_api_maestras + 'Persona';
  private apiURL_UsuarioRol = environment.url_api + 'UsuarioRol';
  private apiURL_TCambio = environment.url_api + 'TCambio';

  public getUsuarioRol(idUsuario:number):Observable<usuarioRolDTO[]>{
    return this.http.get<usuarioRolDTO[]>(`${this.apiURL_UsuarioRol}/listarAll?idUsuario=`+idUsuario);
  }

  public getUsuarioRolDet(idRol:number,idUsuarioRol:number):Observable<usuarioRolDTO[]>{
    return this.http.get<usuarioRolDTO[]>(`${this.apiURL_UsuarioRol}/listarDetalleAll?idRol=`+idRol + `&idRolUsuario=`+idUsuarioRol);
  }

  public getTCambio():Observable<listaTCambioDTO[]>{
    return this.http.get<listaTCambioDTO[]>(`${this.apiURL_TCambio}/listarAll`);
  }

  public crearTCambio(tcambio: grabaTCambioDTO){
    this.getIPAddress();
    tcambio.idUsuarioLogin=this.userContextService.getIdUsuario();
    tcambio.pcHost='web'
    tcambio.pcIp=this.ip;
    return this.http.post(this.apiURL_TCambio+'/agregar',tcambio);
  }


  public getUsuario():Observable<listaUsuarioDTO[]>{
    return this.http.get<listaUsuarioDTO[]>(`${this.apiURL_Usuario}/listarAll`);
  }
  public getUsuarioID(idUsuario:number):Observable<listaUsuarioDTO[]>{
    return this.http.get<listaUsuarioDTO[]>(`${this.apiURL_Usuario}/listarUsuarioPerfil?idUsuario=`+idUsuario);
  }
  
  public eliminaUsuario(usuario: eliminaUsuarioDTO){
    this.getIPAddress();
    usuario.idUsuarioLogin=this.userContextService.getIdUsuario();
    usuario.pcHost='web'
    usuario.pcIp=this.ip;
    const param: string = JSON.stringify(usuario);    
    return this.http.put(`${this.apiURL_Usuario}/eliminar`, usuario);
  }

  public crearUsuarioPerfil(usuario: agregaUsuarioPerfilDTO){
    this.getIPAddress();
    usuario.idUsuarioLogin=this.userContextService.getIdUsuario();
    usuario.pcHost='web'
    usuario.pcIp=this.ip;
    const param: string = JSON.stringify(usuario);
    return this.http.post(`${this.apiURL_PerfilUsuario}/agregar`, usuario);
  }

  public eliminaUsuarioPerfil(usuario: eliminaUsuarioPerfilDTO){
    this.getIPAddress();
    usuario.idUsuarioLogin=this.userContextService.getIdUsuario();
    usuario.pcHost='web'
    usuario.pcIp=this.ip;
    const param: string = JSON.stringify(usuario);    
    return this.http.put(`${this.apiURL_PerfilUsuario}/eliminar`, usuario);
  }


  public crearUsuario(usuario: grabaUsuarioDTO){
    this.getIPAddress();
    usuario.idArea=1;
    usuario.idCargo=1;
    usuario.idUsuarioLogin=this.userContextService.getIdUsuario();
    usuario.pcHost='web'
    usuario.pcIp=this.ip;
    return this.http.post(this.apiURL_Usuario+'/agregarUsuarioPerfil',usuario);
  }

  public actualziaUsuario(usuario: grabaUsuarioDTO){
    this.getIPAddress();
    usuario.idArea=1;
    usuario.idCargo=1;
    usuario.idUsuarioLogin=this.userContextService.getIdUsuario();
    usuario.pcHost='web'
    usuario.pcIp=this.ip;
    return this.http.put(this.apiURL_Usuario+'/modificar',usuario);
  }

  public crearRolUsuario(usuarioRol: usuarioRolDTO[]){
    this.getIPAddress();
    let usuarioRolSel:usuarioRolDTO= new usuarioRolDTO();
    let mensaje:any;
    usuarioRol.forEach((usuarioRolSel:usuarioRolDTO)=>{
      usuarioRolSel.idUsuarioLogin=this.userContextService.getIdUsuario();
      usuarioRolSel.pcHost='web'
      usuarioRolSel.pcIp=this.ip;
      mensaje = this.http.post(this.apiURL_UsuarioRol+'/agregar',usuarioRolSel);
    });
    //usuario.idUsuarioLogin=this.userContextService.getIdUsuario();
    //usuario.pcHost='web'
    //usuario.pcIp=this.ip;
    return mensaje;
    //this.http.post(this.apiURL_Usuario+'/agregarUsuarioPerfil',usuario);
  }

  public getPerfil():Observable<listaPerfilDTO[]>{
    return this.http.get<listaPerfilDTO[]>(`${this.apiURL_Perfil}/listarAll`);
  }

  public getPerfilID(idPerfil:number):Observable<listaPerfilDTO[]>{
    return this.http.get<listaPerfilDTO[]>(`${this.apiURL_Perfil}/listar?id=`+idPerfil);
  }
  public getPerfilUsuario(idUsuario:number):Observable<listaPerfilDTO[]>{
    return this.http.get<listaPerfilDTO[]>(`${this.apiURL_PerfilUsuario}/listarAllxUsuario`+idUsuario);
  }
  public getPerfilModuloID(idPerfil:number):Observable<listaAccionDTO[]>{
    return this.http.get<listaAccionDTO[]>(`${this.apiURL_PerfilModulo}/listarPerfilModulo?idPerfil=`+idPerfil);
  }

  public getModulo():Observable<listaModuloDTO[]>{
  
    return this.http.get<listaModuloDTO[]>(`${this.apiURL_Modulo}/listarAll`);
  }

  public getModuloID(idModulo:number) {
    return this.http.get<listaModuloDTO>(`${this.apiURL_Modulo}/listar?id=`+idModulo);
  }

  public crearModulo(dto: grabarModuloDTO){

    this.getIPAddress();    
    dto.idUsuarioLogin=this.userContextService.getIdUsuario();
    dto.pcHost='web'
    dto.pcIp=this.ip;
    return this.http.post(this.apiURL_Modulo+'/agregar',dto);

    }

  public actualizarModulo(modulo: grabarModuloDTO){
    this.getIPAddress();
    modulo.idUsuarioLogin=this.userContextService.getIdUsuario();
    modulo.pcHost='web';
    modulo.pcIp=this.ip;
    return this.http.put(this.apiURL_Modulo+'/modificar',modulo);
    
  }

  public eliminaModulo(dto: eliminarDTO){
    this.getIPAddress();
    dto.idUsuarioLogin=this.userContextService.getIdUsuario();
    dto.pcHost='web'
    dto.pcIp=this.ip;
    const param: string = JSON.stringify(dto);        
    return this.http.put(`${this.apiURL_Modulo}/eliminar`, dto);
  }

  public crearPerfil(perfil: grabaPerfilDTO){
    this.getIPAddress();
    perfil.idUsuarioLogin=this.userContextService.getIdUsuario();
    perfil.pcHost='web'
    perfil.pcIp=this.ip;
    return this.http.post(this.apiURL_Perfil+'/agregarPerfilModulo',perfil);
  }

  public actualizaPerfil(perfil: actualizaPerfilDTO){
    this.getIPAddress();
    perfil.idUsuarioLogin=this.userContextService.getIdUsuario();
    perfil.pcHost='web'
    perfil.pcIp=this.ip;
    return this.http.put(this.apiURL_Perfil+'/modificar',perfil);
  }

  public eliminaPerfil(usuario: eliminaPerfilDTO){
    this.getIPAddress();
    usuario.idUsuarioLogin=this.userContextService.getIdUsuario();
    usuario.pcHost='web'
    usuario.pcIp=this.ip;
    const param: string = JSON.stringify(usuario);    
    return this.http.put(`${this.apiURL_Perfil}/eliminar`, usuario);
  }

  public eliminaPerfilModulo(modulo: eliminaAccesoDTO){
    this.getIPAddress();
    modulo.idUsuarioLogin=this.userContextService.getIdUsuario();
    modulo.pcHost='web'
    modulo.pcIp=this.ip;
    const param: string = JSON.stringify(modulo);    
    return this.http.put(`${this.apiURL_PerfilModulo}/eliminar`, modulo);
  }

  public actualizaPerfilModulo(modulo: actualizaAccesoDTO){
    this.getIPAddress();
    modulo.idUsuarioLogin=this.userContextService.getIdUsuario();
    modulo.pcHost='web'
    modulo.pcIp=this.ip;
    const param: string = JSON.stringify(modulo);    
    return this.http.post(`${this.apiURL_PerfilModulo}/agregarModificar`, modulo);
  }

  public getPersona():Observable<listaPersonaDTO[]>{
    return this.http.get<listaPersonaDTO[]>(`${this.apiURL_Persona}/listarAll`);
  }  

  public crearPersona(persona: grabaPersonaDTO){
    this.getIPAddress();
    persona.idUsuarioLogin=this.userContextService.getIdUsuario();
    persona.pcHost='web';
    persona.pcIp=this.ip;
    return this.http.post(this.apiURL_Usuario+'/registroCliente',persona);
  }

  public crearPerfilCli(persona: grabaPersonaDTO, idUsuario: number){
    this.getIPAddress();
    persona.idUsuarioLogin=this.userContextService.getIdUsuario();
    persona.pcHost='web'
    persona.pcIp=this.ip;
    return this.http.post(this.apiURL_Usuario+'/registroPerfilCli?idUsuario='+idUsuario,persona);
  }

  public actualizaPersona(persona: modificaPersonaDTO){
    this.getIPAddress();
    persona.idUsuarioLogin=this.userContextService.getIdUsuario();
    persona.pcHost='web'
    persona.pcIp=this.ip;
    return this.http.put(this.apiURL_Usuario+'/modificaPerfilCli',persona);
  }

  public eliminaPersona(eliminar: eliminaDTO){
    this.getIPAddress();
    eliminar.idUsuarioLogin=this.userContextService.getIdUsuario();
    eliminar.pcHost='web'
    eliminar.pcIp=this.ip;
    const param: string = JSON.stringify(eliminar);    
    return this.http.put(`${this.apiURL_Persona}/eliminar`, eliminar);
  }

  public getPersonaID(idPersona:number):Observable<listaPersonaDTO[]>{
    return this.http.get<listaPersonaDTO[]>(`${this.apiURL_Usuario}/listarPerfil?id=`+idPersona);
  }

}
