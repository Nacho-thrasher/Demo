import { ProductsService } from './../../../../services/products.service';
import { Component, OnInit, Input } from '@angular/core';
import { Path } from "../../../../config";
import { DinamicPrice } from "../../../../functions";

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-bought-together',
  templateUrl: './bought-together.component.html',
  styleUrls: ['./bought-together.component.css']
})
export class BoughtTogetherComponent implements OnInit {
  path:String = Path.url;
  @Input() childItem:any;
  products:Array<any> = [];
  price:Array<any> = [];
  render:Boolean = true;
  constructor(private productsService:ProductsService) { }

  ngOnInit(): void {
    
    this.productsService.getFilterData("title_list", this.childItem["title_list"])
    .subscribe(resp =>{
      this.productsFnc(resp);
    })

  }
  //* ==========================================================
  //* Declaramos funcion para mostrar mejores ventas
  productsFnc(response){
    this.products.push(this.childItem)
    //recorrido por la respuesta del filtrado
    let i;
    let getProduct = [];

    for(i in response){

      getProduct.push(response[i]);

    }
    //ordenamos de mayor a menor vitas
    getProduct.sort(function(a,b){
        return (b.views - a.views)
    })
    //filtramos 1 solo prod
    getProduct.forEach((product, index)=>{
      
        if (index < 1) {
          
          this.products.push(product);
         
        }
        
    })

    for(const i in this.products){
      // price========================
      this.price.push(DinamicPrice.fnc(this.products[i]));
    }

  }
  //*=====================================
  //* callback ===========================
  callback(){
    if (this.render) {
      this.render = false;
      
      let price = $(".endPrice .end-price");
      let total = 0;
    
      for(let i = 0; i < price.length; i++){
        total += Number($(price[i]).html())
      }
      $(".ps-block__total strong").html(`$${total.toFixed(2)}`)
    }
  }
}
