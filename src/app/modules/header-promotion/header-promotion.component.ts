import { ProductsService } from '../../services/products.service';

import { Component, OnInit } from '@angular/core';
import { Path } from "../../config";
@Component({
  selector: 'app-header-promotion',
  templateUrl: './header-promotion.component.html',
  styleUrls: ['./header-promotion.component.css']
})
export class HeaderPromotionComponent implements OnInit {
 //url imagenes
  path:any = Path.url;	
  top_banner: object = null; 
  preload: boolean = false;
  category:Object = null;
  url:Object = null;
  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.preload = true;

    this.productsService.getData().subscribe(resp =>{
      //tomar long del object ***********************//
      let i; let size = 0;
      for(i in resp){ size++ }
      //generar aleatorio ***************************//
      let index = Math.floor(Math.random()*size);
      //devolver banner aleatorio *******************//
      this.top_banner = JSON.parse(resp[Object.keys(resp)[index]].top_banner);
      this.category = resp[Object.keys(resp)[index]].category;
      this.url = resp[Object.keys(resp)[index]].url;
      this.preload = false;
    })
  }

}
