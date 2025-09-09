import { Component, OnInit } from '@angular/core';
import { ClientePerfilDTO } from '../../Models/cl-perfil.model';
import { Subscription } from 'rxjs';
import { ClPerfilService } from '../../Services/cl-perfil.service';
import { StorageService } from 'src/app/Modulo-seguridad/Services/storage.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cl-cambiaperfil-dialog',
  templateUrl: './cl-cambiaperfil-dialog.component.html',
  styleUrls: ['./cl-cambiaperfil-dialog.component.css']
})
export class ClCambiaperfilDialogComponent implements OnInit {
  subscription!: Subscription;
  listPerfil: ClientePerfilDTO[]=[];
  idUsuario:number=0;

  constructor(
    private clperfilService: ClPerfilService,
    private storageService: StorageService,
    public dialogRef: MatDialogRef<ClCambiaperfilDialogComponent>
    ) { }

  ngOnInit(): void {
    this.idUsuario = this.storageService.getItemDecrypt('idUsuario');
    this.listaClientePerfil();
  }

  listaClientePerfil(){
    this.subscription = new Subscription();
    this.subscription = this.clperfilService.getClientePerfilAll(this.idUsuario)
    .subscribe((resp: ClientePerfilDTO[]) => {
      if (resp) {
          this.listPerfil = resp;
        }
      },
      (error) => console.error(error));
  }
  selectPerfil(item:ClientePerfilDTO){
    this.storageService.setItemEncrypt('idClientePerfil', item.idClientePerfil);
    this.storageService.setItemEncrypt('clientePerfil', item.perfil);
    this.dialogRef.close();
  }
}
