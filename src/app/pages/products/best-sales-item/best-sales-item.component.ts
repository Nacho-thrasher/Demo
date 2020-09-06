import { ActivatedRoute } from '@angular/router';
import { ProductsService } from './../../../services/products.service';
import { Component, OnInit } from '@angular/core';
import { Path } from "../../../config";
import { OwlCarouselConfig, CarouselNavigation, Rating, DinamicRating, DinamicReviews, DinamicPrice } from "../../../functions";

declare var jQuery:any;
declare var $:any;

// OwlCarouselConfig, CarouselNavigation, SlickConfig, ProductLightbox, CountDown, Rating, ProgressBar
@Component({
  selector: 'app-best-sales-item',
  templateUrl: './best-sales-item.component.html',
  styleUrls: ['./best-sales-item.component.css']
})
export class BestSalesItemComponent implements OnInit {

  path:String = Path.url;
  bestSalesItem:Array<any> = [];
  render:Boolean = true;
  rating:Array<any> = [];
  reviews:Array<any> = [];
  price:Array<any> = [];
  cargando:Boolean = false;

  constructor(private productsService:ProductsService,
              private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.cargando = true;
    //param url
    let params = this.activatedRoute.snapshot.params["param"].split("&")[0];

    //filtrar datos prods with categs
    this.productsService.getFilterData("category", params)
    .subscribe(resp =>{

      if (Object.keys(resp).length > 0) {
          
            this.productsFnc(resp)
      
      }
      else{
          //filtrar subcats
          this.productsService.getFilterData("sub_category", params)
          .subscribe(resp2 =>{

                  this.productsFnc(resp2);
      
          })
    
      }
      
    })
    
  
  }
  //declaramos funcion para mostrar mejores ventas
  productsFnc(response){

    this.bestSalesItem = [];
    //recorrido por la respuesta del filtrado
    let i;
    let getSales = [];

    for(i in response){

      getSales.push(response[i]);

    }
    //ordenear de mayor a menor
    getSales.sort(function(a,b){

      return (b.sales - a.sales)

    })
    //solos 10 prods
    getSales.forEach((product, index)=>{
       
        if (index < 10) {
          this.bestSalesItem.push(product);         
          
          this.rating.push(DinamicRating.fnc(this.bestSalesItem[index]));
          
          this.reviews.push(DinamicReviews.fnc(this.rating[index]));
        
          this.price.push(DinamicPrice.fnc(this.bestSalesItem[index])); 
        
          this.cargando = false;
        }
    })

  }
  
  //callback
  callback(){
    if (this.render) {
        this.render = false;
    
        OwlCarouselConfig.fnc();
        CarouselNavigation.fnc();
        Rating.fnc();
    }
  }

}
