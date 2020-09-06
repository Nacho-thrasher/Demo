import { Component, OnInit } from '@angular/core';
import { Path } from "../../../config";
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from './../../../services/products.service';
import { OwlCarouselConfig, CarouselNavigation, Rating, DinamicRating, DinamicReviews, DinamicPrice } from "../../../functions";

@Component({
  selector: 'app-recommended',
  templateUrl: './recommended.component.html',
  styleUrls: ['./recommended.component.css']
})
export class RecommendedComponent implements OnInit {

  path:String = Path.url;
  recommendedItems:Array<any> = [];
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
  //* Declaramos funcion para mostrar mejores ventas ============
  productsFnc(response){

    this.recommendedItems = [];
    //recorrido por la respuesta del filtrado
    let i;
    let getSales = [];

    for(i in response){

      getSales.push(response[i]);

    }
    //ordenear de mayor a menor
    getSales.sort(function(a,b){

      return (b.views - a.views)

    })
    //solos 10 prods
    getSales.forEach((product, index)=>{
       
        if (index < 10) {
          this.recommendedItems.push(product);         
          
          this.rating.push(DinamicRating.fnc(this.recommendedItems[index]));
          
          this.reviews.push(DinamicReviews.fnc(this.rating[index]));
        
          this.price.push(DinamicPrice.fnc(this.recommendedItems[index])); 
        
          this.cargando = false;
        }
    })

  }
  
  //*callback
  callback(){
    if (this.render) {
        this.render = false;
    
        OwlCarouselConfig.fnc();
        CarouselNavigation.fnc();
        Rating.fnc();
    }
  }

}
