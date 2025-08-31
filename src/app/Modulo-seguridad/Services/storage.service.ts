import { Injectable } from '@angular/core';
import { CifrarDataService } from './cifrar-data.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private cifrarDataService: CifrarDataService) { }
  /**
   * Cifrado set local storage item
   */
   setItemEncrypt(key: string, value: any) {
    // Obtenemos el dato encriptado
    let valueEncrypt = this.cifrarDataService.encrypt(value);
    this.setItem(key, valueEncrypt);
  }

  /**
   * Cifrado get local storage item
   */
  getItemDecrypt(key: string) {
    // Obtenemos el dato encriptado
    let value = this.getItem(key);
    let valueEncrypt = this.cifrarDataService.decrypt(value);
    return valueEncrypt;
  }

  /**
   * set local storage item
   */
  setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));

  }

  /**
   * get local storage item
   */
  getItem(key: string): any {
    let value = localStorage.getItem(key);
    return JSON.parse(value!);
  }

  /**
   * remove local storage item
   */
  removeItem(key: string) {
    localStorage.removeItem(key);
  }

  /**
   * remove all local storage items
   */
  clear() {
    localStorage.clear();
  }

  logout() {
    let usuario = '';
    if (this.getItem('usuario')) {
      usuario = this.getItem('usuario')
    }
    this.clear();
    this.setItem('usuario', '');
  }
}
