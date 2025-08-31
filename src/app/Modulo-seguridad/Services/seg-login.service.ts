import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { cambiaClaveDTO, listaAmbienteDTO, loginModel, restauraClaveDTO } from '../Models/seg-login.model';
import { UserContextService } from './user-context.service';

@Injectable({
  providedIn: 'root'
})
export class SegLoginService {

  constructor(private http: HttpClient, private userContextService: UserContextService) { }
  private apiURL_Usuario = environment.url_api + 'Usuario';

  public obtenerAmbiente(){
    return this.http.get(this.apiURL_Usuario+'/obtenerAmbiente');
  }

  public login(usuario: loginModel){
    return this.http.post(this.apiURL_Usuario+'/validarUsuario',usuario);
  }

  public obtienePermisosPorUsuario(idUsuario:number){
    return this.http.get(this.apiURL_Usuario+'/listarUsuarioModulo?id='+idUsuario);
  }

  public restauraClave(usuario: restauraClaveDTO){  
    usuario.idUsuarioLogin=0
    usuario.pcHost='';
    usuario.pcIp='';
    return this.http.put(this.apiURL_Usuario+'/restaurarClave',usuario);
    }
    public cambiaClave(usuario: cambiaClaveDTO){  
      usuario.pcHost='';
      usuario.pcIp='';
      return this.http.put(this.apiURL_Usuario+'/cambiarClave',usuario);
      }
    

}
