import { StoresService } from './../../../../services/stores.service';
import { Component, OnInit, Input } from '@angular/core';
import { Path } from "../../../../config";

@Component({
  selector: 'app-vendor-store',
  templateUrl: './vendor-store.component.html',
  styleUrls: ['./vendor-store.component.css']
})
export class VendorStoreComponent implements OnInit {
  @Input() childItem:any
  store:Array<any> = [];
  path:String = Path.url;

  constructor(private storesService:StoresService) { }

  ngOnInit(): void {
      this.storesService.getFilterData("store", this.childItem).subscribe(resp=>{
          for(const i in resp){
            this.store.push(resp[i])
          }
      })
  }

}
