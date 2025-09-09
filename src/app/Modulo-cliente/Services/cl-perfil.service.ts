import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { eliminaDTO } from 'src/app/Modulo-seguridad/Models/seg-mantenimiento.model';
import { UserContextService } from 'src/app/Modulo-seguridad/Services/user-context.service';
import { DashboardDTO, EliminarDTO } from 'src/assets/Model/general.model';
import { environment } from 'src/environments/environment';
import { ClientePerfilDTO, dashboardCliente, listaAyo, listaCuentaBanco, listaMes, listaOperacionAgregaDTO, listaOperacionDTO, OperacionActualizaDTO, PerfilcuentaBancariaDTO } from '../Models/cl-perfil.model';

@Injectable({
  providedIn: 'root'
})
export class ClPerfilService {
  ip:string=''; 

  
  private meses:listaMes[] = [
    { mes: 1, nombreMes: 'Enero' },
    { mes: 2, nombreMes: 'Febrero' },
    { mes: 3, nombreMes: 'Marzo' },
    { mes: 4, nombreMes: 'Abril' },
    { mes: 5, nombreMes: 'Mayo' },
    { mes: 6, nombreMes: 'Junio' },
    { mes: 7, nombreMes: 'Julio' },
    { mes: 8, nombreMes: 'Agosto' },
    { mes: 9, nombreMes: 'Setiembre' },
    { mes: 10, nombreMes: 'Octubre' },
    { mes: 11, nombreMes: 'Noviembre' },
    { mes: 12, nombreMes: 'Diciembre' },
  ];

  constructor(private http: HttpClient,
    private userContextService: UserContextService) { }
    getIPAddress()
    {
      this.http.get("http://api.ipify.org/?format=json").subscribe((res:any)=>{
        //console.log(res.ip);
        this.ip = res.ip;
      });

    }

    private apiURL = environment.url_api + 'ClientePerfil';
    private apiURL_Operacion = environment.url_api + 'Operacion';
    private apiURL_dash = environment.url_api + 'Dashboard';

    public getClientePerfilAll(idUsuario:number):Observable<ClientePerfilDTO[]> {
      return this.http.get<ClientePerfilDTO[]>(`${this.apiURL}/listarAll?idUsuario=`+idUsuario);
    }

    public crearCuentaBanco(cuenta: PerfilcuentaBancariaDTO){
      return this.http.post(this.apiURL+'/crearCuentaBanco',cuenta);
    }
    public listaCuentaBanco(idClientePerfil:number):Observable<listaCuentaBanco[]> {
      return this.http.get<listaCuentaBanco[]>(`${this.apiURL}/listarCuentaBanco?idClientePerfil=`+idClientePerfil);
    }
    public listaCuentaBancoNeg():Observable<listaCuentaBanco[]> {
      return this.http.get<listaCuentaBanco[]>(`${this.apiURL}/listarCuentaBancoNeg`);
    }

    public listaOperacion(idClientePerfil:number):Observable<listaOperacionDTO[]> {
      return this.http.get<listaOperacionDTO[]>(`${this.apiURL_Operacion}/listarAll?idclientePerfil=`+idClientePerfil);
    }

    public crearoperacion(operacion: listaOperacionAgregaDTO){
      this.getIPAddress();
      operacion.idUsuarioLogin=this.userContextService.getIdUsuario();
      operacion.pcHost='web'
      operacion.pcIp=this.ip;
      return this.http.post(this.apiURL_Operacion+'/agregaOperacion',operacion);
    }
    public actualizaoperacion(operacion: OperacionActualizaDTO){
      this.getIPAddress();
      operacion.idUsuarioLogin=this.userContextService.getIdUsuario();
      operacion.pcHost='web'
      operacion.pcIp=this.ip;
      return this.http.put(this.apiURL_Operacion+'/actualizaOperacion',operacion);
    }

    public subirArchivo(id:number,formData: FormData){
      return this.http.post(`${this.apiURL_Operacion}/uploadFile?id=`+id, formData, { reportProgress: true });
    }
    
    public descargaArchivo(id:number, documento:string) {
      //return this.http.get<listaCuentaBanco[]>(`${this.apiURL}/descargar?id=`+id + '&Documento='+documento);
      return this.http.get(`${this.apiURL_Operacion}/descargar?id=${id}&Documento=${documento}`, {responseType: 'blob'});
    }

    public actualziaoperacion(operacion: eliminaDTO){
      return this.http.post(this.apiURL_Operacion+'/actualizaOperacion',operacion);
    }

    public obtenerMeses(): listaMes[] {
      return this.meses;
    }
    public obtenerAyos(): listaAyo[] {
      const anioActual = new Date().getFullYear();
      const anios: listaAyo[] = [];
  
      for (let i = 0; i < 5; i++) {
        anios.push({ayo: anioActual - i });
      }
      return anios;
    }

    public dashboardCliente(codigoMerchant:string,ayo:number,mes:number):Observable<dashboardCliente[]> {
      return this.http.get<dashboardCliente[]>(`${this.apiURL}/dashboardCliente?codigoMerchant=`+codigoMerchant+`&ayo=`+ayo+`&mes=`+mes);
    }

    public dashboardAPP(codigoMerchant:string,ayo:number):Observable<DashboardDTO[]> {
      return this.http.get<DashboardDTO[]>(`${this.apiURL_dash}/dashAPP?codigo_merchant=`+codigoMerchant+`&ayo=`+ayo);
    }


}
