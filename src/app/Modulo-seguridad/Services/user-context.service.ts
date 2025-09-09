import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';

const defaultUser = null;

@Injectable({
  providedIn: 'root'
})
export class UserContextService {
  public user$ = new BehaviorSubject(defaultUser);
  constructor(private storageService: StorageService, private router: Router) {
    let data = null;

    if (this.storageService.getItem('currentUser')) {
      data = this.storageService.getItemDecrypt('currentUser');
    }

    if ( data != null)
    {
      this.user$.next(data);
    }
  }

  public getIdUsuario(): number {
    return Number(this.storageService.getItemDecrypt('idUsuario'));
  }

  public getPersona(): number {
    return Number(this.storageService.getItemDecrypt('idPersona'));
  }

  public getNombreCompletoUsuario(): string {
    return this.storageService.getItemDecrypt('nombre');
  }

  public getEmail(): string {
    return this.storageService.getItemDecrypt('email');
  }

  public getUsuario() {
    return this.storageService.getItemDecrypt('usuario');
  }

  public getIdPerfil() {
    return this.storageService.getItemDecrypt('idPerfil');
  }

  public setUser(user: any)
  {
    this.storageService.setItemEncrypt('currentUser', user);
    this.user$.next(user);
  }

  public logout()
  {
    this.storageService.logout();
    this.user$.next(defaultUser);
    this.redirecciona();
  }

  private redirecciona() {
    this.router.navigate(['/login']);
  }
  
}
