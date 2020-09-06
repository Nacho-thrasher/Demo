import { Component, OnInit } from '@angular/core';
import { ProductsService } from './../../../services/products.service';
import { Path } from "../../../config";
import { ActivatedRoute } from '@angular/router';
import { Rating, DinamicRating, DinamicReviews, DinamicPrice, Pagination, select2Cofig } from "../../../functions";

declare var jQuery: any;
declare var $:any;

@Component({
  selector: 'app-search-showcase',
  templateUrl: './search-showcase.component.html',
  styleUrls: ['./search-showcase.component.css']
})
export class SearchShowcaseComponent implements OnInit {

  path:String = Path.url;
  products:Array<any> = [];
  render:Boolean = true;
  cargando:Boolean = false;
  rating:Array<any> = [];
  reviews:Array<any> = [];
  price:Array<any> = [];
  params:string = null;
  page;
  productFound:Number = 0;
	currentRoute:String = null;
	totalPage:Number = 0;
  sort;
  sortItems:Array<any> = [];
  sortValues:Array<any> = [];
  properties:Array<any> = ["category","name","store","sub_category","tags","title_list","url"];
  listProducts:Array<any> = [];

  constructor(private productsService:ProductsService,
              private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.cargando = true;
    
    this.params = this.activatedRoute.snapshot.params["param"]
    .split("&")[0];
    
    this.sort = this.activatedRoute.snapshot.params["param"]
    .split("&")[1];
    
    this.page = this.activatedRoute.snapshot.params["param"]
    .split("&")[2];
    
    //EVALUAMOS QUE EL SEGUNDO PARAM SEA DE PAGINACION
    if (Number.isInteger(Number(this.sort))) {

      this.page = this.sort;
      this.sort = undefined;
    
    }
    // *===================================================
    // *evaluamos q el parametro de orden no este definido 
    // *===================================================
    if (this.sort == undefined) {
      // aqui entra si es un numero y si es numero es paginacion pensa
      this.currentRoute = `search/${this.params}`;  
    
    }else{
      // sino es un string osea q es un filtro 
      this.currentRoute = `search/${this.params}&${this.sort}`;
    
    }

    // * Filtrar datos prods with categs
    this.properties.forEach(property =>{

        this.productsService.getSearchData(property, this.params)
        .subscribe(resp =>{

          let i;
          for(i in resp){
            this.listProducts.push(resp[i]);  
          }
          
          this.productsFnc(this.listProducts)
        
        })
    })



  }
  // * Declaramos funcion para mostrar catalogo
  productsFnc(response){
    
    if (response.length > 0) {
      
        this.products = [];

        //recorrido por la respuesta del filtrado
        let i;
        let getProducts = [];
        let total = 0;

        for(i in response){

          total++;

        getProducts.push(response[i]);						
          
        }
        //NUMBER OF PRODUCTS =======================
        this.productFound = total;
        this.totalPage =  Math.ceil(Number(this.productFound)/6);      
        
        // *=======================================
        // *ordenamos productos ==============================================
        // *=======================================
        if(this.sort == undefined || this.sort == "first"){
          getProducts.sort(function (a, b) {
              return (b.date_created - a.date_created)
          })
          this.sortItems = [
            "Sort by first",
            "Sort by latest",
            "Sort by popularity",
            "Sort by price low to high",
            "Sort by price high to low"
          ]
          this.sortValues = [
            "first",
            "latest",
            "popularity",
            "low",
            "high"
          ]
    
        }
            //antiguo 
        if(this.sort == "latest"){
          getProducts.sort(function (a, b) {
              return (a.date_created - b.date_created)
          })
          this.sortItems = [
            "Sort by latest",
            "Sort by first",	
            "Sort by popularity",
            "Sort by price: low to high",
            "Sort by price: high to low"
          ]
          this.sortValues = [
            "latest",
            "first",
            "popularity",
            "low",
            "high"
          ]
        }
            //vistos
        if (this.sort == "popularity") {
          getProducts.sort(function(a,b){
            return (b.views - a.views)
          })
          this.sortItems = [
            "sort by popularity",
            "sort by first",
            "sort by latest",
            "sort by price low to high",
            "sort by price high to low"
          ]
          this.sortValues = [
            "popularity",
            "first",
            "latest",
            "low",
            "high"
          ]
        }
            //precio
        if (this.sort == "low") {
          getProducts.sort(function(a,b){
            return (a.price - b.price)
          })
          this.sortItems = [
            "sort by price low to high",
            "sort by first",
            "sort by latest",
            "sort by popularity",
            "sort by price high to low"
          ]
          this.sortValues = [
            "low",
            "first",
            "latest",
            "popularity",
            "high"
          ]
        }
            //precio mayor a menor
        if (this.sort == "high") {
          getProducts.sort(function(a,b){
            return (b.price - a.price)
          })
          this.sortItems = [
            "sort by price high to low",
            "sort by first",
            "sort by latest",
            "sort by popularity",
            "sort by price low to high"
          ]
          this.sortValues = [
            "high",
            "first",
            "latest",
            "popularity",
            "low"
          ]
        }

        //solos 10 prods
        getProducts.forEach((product, index)=>{

          //si vie ne numero de pagina def
          if(this.page == undefined){

            this.page = 1;
          }
          
          //desde  hasta
          let first = Number(index) + (this.page*6)-6; 
          let last = 6*this.page;

          if (first < last) {
            
            if (getProducts[first] != undefined) {
            
            this.products.push(getProducts[first]);         
            
            this.rating.push(DinamicRating.fnc(getProducts[first]));
            
            this.reviews.push(DinamicReviews.fnc(this.rating[index]));
          
            this.price.push(DinamicPrice.fnc(getProducts[first])); 
          
            this.cargando = false;
                
            }

          }
        })
    }
    else{
      this.cargando = false;
    }
  }
  // * callback
  callback(params){

    if (this.render) {
        this.render = false;        

        Rating.fnc();
        Pagination.fnc();
        select2Cofig.fnc();
        
      //CAPTURAR SORT ITEMS ORDER
      $(".sortItems").change(function(){
          window.open(`search/${params}&${$(this).val()}`,'_top')
      })

      }

  }

}
