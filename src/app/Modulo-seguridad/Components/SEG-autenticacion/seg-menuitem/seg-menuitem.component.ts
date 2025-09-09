import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/Modulo-seguridad/Services/storage.service';

@Component({
  selector: 'app-seg-menuitem',
  templateUrl: './seg-menuitem.component.html',
  styleUrls: ['./seg-menuitem.component.css']
})
export class SegMenuitemComponent implements OnInit {

  @Input() menuListaHijo: any;
  
  constructor(private router: Router,
    private readonly storageService: StorageService) { }

  ngOnInit(): void {
    //console.log(this.menuListaHijo);
  }
  selModulo(item: any){
    //console.log(item);
    if (item.url != ''){
      this.storageService.setItemEncrypt('idModulo', item.idModulo);
      this.router.navigate(['main/' + item.url]);
    }
  }
}
