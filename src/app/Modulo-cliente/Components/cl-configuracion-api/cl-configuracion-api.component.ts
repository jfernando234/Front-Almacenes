import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/Modulo-seguridad/Services/storage.service';

@Component({
  selector: 'app-cl-configuracion-api',
  templateUrl: './cl-configuracion-api.component.html',
  styleUrls: ['./cl-configuracion-api.component.css']
})
export class ClConfiguracionApiComponent implements OnInit {

  codigo_merchant:string='asd';
  secretUserPO:string='UserApiPayout';
  secretPassPO:string='P3ym3nt2023@#';
  secretUserPI:string='UserApiPayint';
  secretPassPI:string='P3yAm3pnt1In_202@#';
  
  constructor(
    private storageService: StorageService,
  ) { }

  ngOnInit(): void {
    this.codigo_merchant = this.storageService.getItemDecrypt('codigo_merchant');
  }

}
