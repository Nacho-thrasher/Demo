import { Component, OnInit } from '@angular/core';
import { Path } from "../../../config";
import { ProductsService } from './../../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { Quantity, SlickConfig, ProductLightbox, Tabs , ProgressBar ,CountDown ,Rating, DinamicRating, DinamicReviews, DinamicPrice } from "../../../functions";

@Component({
  selector: 'app-similar-bought',
  templateUrl: './similar-bought.component.html',
  styleUrls: ['./similar-bought.component.css']
})
export class SimilarBoughtComponent implements OnInit {
  path:String = Path.url;
  products:Array<any> = [];
  rating:Array<any> = [];
  reviews:Array<any> = [];
  price:Array<any> = [];
  cargando:Boolean = false;
  render:Boolean = true;
  
  constructor(private activatedRoute:ActivatedRoute,
              private productsService:ProductsService) { }

  ngOnInit(): void {
    this.cargando = true;
    
    this.productsService.getFilterData("url",
        this.activatedRoute.snapshot.params["param"]).subscribe(resp=>{

            for(const i in resp){
              this.productsService.getFilterData("sub_category", resp[i].sub_category).
              subscribe(resp=>{

                this.productsFnc(resp);

              })

            }
        })

  }
  productsFnc(response){
      this.products = [];
      //recorrido por la respuesta del filtrado
      let i;
      let getProduct = [];

      for(i in response){

        getProduct.push(response[i]);

      }
      //* ordenar ====================
      getProduct.sort(function(a,b){
        return (b.views - a.views)
      })

      //* ==========================================================
      //* filtramos el producto  
      getProduct.forEach((product, index)=>{
          if (index < 6) {

            this.products.push(product)
          
            /*=============================================
	        	Rating y Review
	        	=============================================*/
	        
	        	this.rating.push(DinamicRating.fnc(this.products[index]));
	        
	        	this.reviews.push(DinamicReviews.fnc(this.rating[index]));
	      
	        	/*=============================================
	        	Price
	        	=============================================*/        

	        	this.price.push(DinamicPrice.fnc(this.products[index]));
				
				  this.cargando = false;
          
          }

      })
  }
  callback(){
    if(this.render){

      this.render = false;

      setTimeout(function(){
        Rating.fnc();
      },1000)

    }
  }
}
