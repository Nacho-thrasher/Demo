import { ProductsService } from './../../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Path } from "../../../config";
import { Quantity, SlickConfig, ProductLightbox, Tabs , ProgressBar ,CountDown ,Rating, DinamicRating, DinamicReviews, DinamicPrice } from "../../../functions";


@Component({
  selector: 'app-product-left',
  templateUrl: './product-left.component.html',
  styleUrls: ['./product-left.component.css']
})
export class ProductLeftComponent implements OnInit {
  
  path: String = Path.url;
  product:Array<any> = [];
  rating:Array<any> = [];
  reviews:Array<any> = [];
  price:Array<any> = [];
  cargando:Boolean = false;
  render:Boolean = true;
  renderGallery:Boolean = true;
  countD:Array<any> = [];
  gallery:Array<any> = [];
  video:string = null;
  tags:string = null;
  totalReviews:String;

  constructor(private activatedRoute:ActivatedRoute,
              private productsService:ProductsService) { }

  ngOnInit(): void {
    this.cargando = true;
    //* obtener paramentros ===========================
      this.productsService.getFilterData("url",
          this.activatedRoute.snapshot.params["param"]).subscribe(resp =>{
            this.productsFnc(resp);		
          })
    //*================================================
  }
  //* ==========================================================
  //* Declaramos funcion para mostrar mejores ventas
  productsFnc(response){

    this.product = [];
    //recorrido por la respuesta del filtrado
    let i;
    let getProduct = [];

    for(i in response){

      getProduct.push(response[i]);

    }
    //* ==========================================================
    //* filtramos el producto  
    getProduct.forEach((product, index)=>{
       
        this.product.push(product);         
        
        this.rating.push(DinamicRating.fnc(this.product[index]));
        
        this.reviews.push(DinamicReviews.fnc(this.rating[index]));
      
        this.price.push(DinamicPrice.fnc(this.product[index])); 
     
        //*fecha descontador
        if (this.product[index].offer != "") {
          const date = JSON.parse(this.product[index].offer)[2] 
            this.countD.push(
              new Date(
                parseInt(date.split("-")[0]),
                parseInt(date.split("-")[1])-1,
                parseInt(date.split("-")[2])
              )
            )
        
        }
        //* ===============================================
        //* gallery
        this.gallery.push(JSON.parse(
          this.product[index].gallery))
        //* ===============================================
        //* video
        if(JSON.parse(this.product[index].video)[0] == "youtube"){

          this.video = `https://www.youtube.com/embed/${JSON.parse(this.product[index].video)[1]}?rel=0&autoplay=0 `
  
        }
        if(JSON.parse(this.product[index].video)[0] == "vimeo"){
  
          this.video = `https://player.vimeo.com/video/${JSON.parse(this.product[index].video)[1]}`
          
        }
        //* ===============================================
        //* agregando tags
        this.tags = this.product[index].tags.split(",");
        //*========================
        //* total reviews =========
        this.totalReviews = JSON.parse(this.product[index].reviews).length;
                  
      this.cargando = false;
    })

  }
  //* ==========================================================
  //* callback
  callback(){
    if (this.render) {
        this.render = false;

        Rating.fnc();
        CountDown.fnc();  
        ProgressBar.fnc();
        Tabs.fnc();
        Quantity.fnc();
        SlickConfig.fnc();
    }
  }
  callbackGallery(){
    if (this.callbackGallery) {
      this.renderGallery = false;
      ProductLightbox.fnc();
    }
  }

} 
