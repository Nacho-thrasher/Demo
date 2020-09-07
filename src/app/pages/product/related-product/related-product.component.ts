import { Component, OnInit } from '@angular/core';
import { Path } from "../../../config";
import { ProductsService } from './../../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { OwlCarouselConfig, CarouselNavigation, Quantity, SlickConfig, ProductLightbox, Tabs , ProgressBar ,CountDown ,Rating, DinamicRating, DinamicReviews, DinamicPrice } from "../../../functions";

@Component({
  selector: 'app-related-product',
  templateUrl: './related-product.component.html',
  styleUrls: ['./related-product.component.css']
})
export class RelatedProductComponent implements OnInit {
  
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
              this.productsService.getFilterData("category", resp[i].category).
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
          if (index < 10) {

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
      
      OwlCarouselConfig.fnc();
      CarouselNavigation.fnc();
      setTimeout(function(){
        Rating.fnc();
        
      },1000)

    }
  }

}
