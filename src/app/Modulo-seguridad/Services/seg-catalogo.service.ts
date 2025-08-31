import { Injectable } from '@angular/core';
import { UserContextService } from './user-context.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { dniDTO, rucDTO } from '../Models/seg-catalogo.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SegCatalogoService {

  constructor(
    private http: HttpClient,
    private userContextService: UserContextService
  ) { }
  private apiURL = environment.url_api + 'Catalogos';

  public getDNI(dni:string):Observable<dniDTO> {
    return this.http.get<dniDTO>(`${this.apiURL}/obtenerDNI?dni=`+dni);
   }

   public getRUC(ruc:string):Observable<rucDTO> {
    return this.http.get<rucDTO>(`${this.apiURL}/obtenerRUC?ruc=`+ruc);
   }

}
