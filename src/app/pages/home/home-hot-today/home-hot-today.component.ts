import { SalesService } from './../../../services/sales.service';
import { ProductsService } from './../../../services/products.service';
import { Component, OnInit } from '@angular/core';
import { Path } from "../../../config";
import { OwlCarouselConfig, CarouselNavigation, SlickConfig, ProductLightbox, CountDown, Rating, ProgressBar } from "../../../functions";

declare var jQuery: any;
declare var $:any;

@Component({
  selector: 'app-home-hot-today',
  templateUrl: './home-hot-today.component.html',
  styleUrls: ['./home-hot-today.component.css']
})
export class HomeHotTodayComponent implements OnInit {

  path:String = Path.url;
  indexes:Array<any> = [];
  render: Boolean = true;
  products:Array<any> = [];
  cargando:Boolean = false;
  topSales:Array<any> = [];
  topSalesBlock:Array<any> = [];
  renderBestSeller: Boolean = true;

  constructor(private productsService:ProductsService, private salesService:SalesService) { }

  ngOnInit(): void {

    this.cargando = true;

    let getProducts = [];
    let hoy = new Date();
    let fechaOferta = null;
    
    this.productsService.getData().subscribe(resp =>{
      let i;
      for(i in resp){
        getProducts.push({
          "offer": JSON.parse(resp[i].offer),
          "stock": resp[i].stock
        })
        this.products.push(resp[i])
      }
      /*=============================================
			Recorremos cada oferta y stock para clasificar las ofertas actuales y los productos que si tengan stock
			=============================================*/

      for(i in getProducts){
          fechaOferta = new Date(
            //split averiguar
            parseInt(getProducts[i]['offer'][2].split("-")[0]),
            parseInt(getProducts[i]["offer"][2].split("-")[1])-1,
            parseInt(getProducts[i]["offer"][2].split("-")[2])

          )
          if (hoy < fechaOferta && getProducts[i]["stock"] > 0 ) {
              this.indexes.push(i);
              this.cargando = false;          
          }
      }

    })
    /*=============================================
	  dats de ventas
	  =============================================*/  
    let getSales = [];

    this.salesService.getData().subscribe(resp=>{
      //recorremos resp
      let i;
      for(i in resp){
        getSales.push({
          "product": resp[i].product,
          "quantity": resp[i].quantity
        })
      }
      //ordenar de mayor a menor b -> a
      getSales.sort(function(a,b){
        return(b.quantity - a.quantity)
      })
      //sacar nums repetidos 
      let filterSales = [];
      getSales.forEach(sale =>{

        if (!filterSales.find( resp => resp.product == sale.product )) {
          const {
            product, quantity
          } = sale;
          
          filterSales.push({
            product, quantity
          })
        }
      })
      // searching consecuencias con productos
      let block = 0;
      filterSales.forEach((sale, index)=>{
          
        if (index < 20) {
          block++;

          this.productsService.getFilterData("name", sale.product)
          .subscribe(resp =>{
            let i;
            for(i in resp){

              this.topSales.push(resp[i])

            }
            
          })       
        }
      })
      //maximo bloqes
      for(let i = 0; i < Math.round(block/4); i++){
        this.topSalesBlock.push(i);
      }
      
    })

  /*=============================================
	END NG ON INIT
	=============================================*/
  }

  /*=============================================
	Función que nos avisa cuando finaliza el renderizado de Angular
	=============================================*/
  callback(){
    if (this.render) {
      
      this.render = false;
      /*=============================================
			Seleccionar del DOM los elementos de la galería mixta
			=============================================*/	

      let galleryMix_1 = $(".galleryMix_1");
      let galleryMix_2 = $(".galleryMix_2");
      let galleryMix_3 = $(".galleryMix_3");

      
      /*=============================================
			Seleccionar del DOM los elementos de la oferta
			=============================================*/	

      let offer_1 = $(".offer_1");
      let offer_2 = $(".offer_2");
      let offer_3 = $(".offer_3");

      /*=============================================
      Seleccionar del DOM los elementos de la oferta
      =============================================*/	

      let review_1 = $(".review_1");
      let review_2 = $(".review_2");
      let review_3 = $(".review_3");

      /*=============================================
			Recorremos todos los índices de productos
			=============================================*/

      for(let i = 0; i < galleryMix_1.length; i++){

        /*=============================================
				Recorremos todos las fotografías de la galería de cada producto
				=============================================*/	

        for(let f = 0; f < JSON.parse($(galleryMix_1[i]).attr("gallery")).length; f++ ){
          
          /*=============================================
					Agregar imágenes grandes
					=============================================*/	

          $(galleryMix_2[i]).append(
            `<div class="item">
              <a href="assets/img/products/${$(galleryMix_1[i]).attr("category")}/gallery/${JSON.parse($(galleryMix_1[i]).attr("gallery"))[f]}">
                <img src="assets/img/products/${$(galleryMix_1[i]).attr("category")}/gallery/${JSON.parse($(galleryMix_1[i]).attr("gallery"))[f] }" alt="" />
              </a>
            </div>
          `)

          /*=============================================
					Agregar imágenes pequeñas
					=============================================*/

          $(galleryMix_3[i]).append(
						`<div class="item">
              <img src="assets/img/products/${$(galleryMix_1[i]).attr("category")}/gallery/${JSON.parse($(galleryMix_1[i]).attr("gallery"))[f]}">
	          </div>`
          )
        }
        //==================
        //ofer
        //==================
        let offer = JSON.parse($(offer_1[i]).attr("offer"));

        let price = Number($(offer_1[i]).attr("price"));

        if (offer[0] == "Disccount") {
          $(offer_1[i]).html(
          
            `<span>Save<br/>$${(price * offer[1]/100).toFixed(2)}</span>`
          )
          $(offer_2[i]).html(`$${(price-(price * offer[1]/100)).toFixed(2)}`)
        }
        if (offer[0] == "Fixed") {
          $(offer_1[i]).html(

						`<span>Save <br> $${(price-offer[1]).toFixed(2) }</span>`

					)

					$(offer_2[i]).html(`$${offer[1]}`)
        }
        //descontador
        $(offer_3[i]).attr("data-time",
          new Date(
          //split averiguar
            parseInt(offer[2].split("-")[0]),
            parseInt(offer[2].split("-")[1])-1,
            parseInt(offer[2].split("-")[2])
          )
        )
        /*=============================================
			  calculamos total de clificaciones 
        =============================================*/
        let totalReview = 0;
        
        for(let f = 0; f < JSON.parse($(review_1[i]).attr("reviews")).length; f++ ){
          totalReview += Number(
              JSON.parse($(review_1[i]).attr("reviews"))[f]["review"]
          )
        }
        /*=============================================
			  imprimir clificaciones 
        =============================================*/
        let rating = Math.round(totalReview/JSON.parse($(review_1[i]).attr("reviews")).length);

        $(review_3[i]).html(rating);

        for(let f = 1; f <=5; f++){
          $(review_2[i]).append(
            `<option value="2">${f}</option>`  
          )
          if (rating == f) {
            $(review_2[i]).children('option').val(1)
          }  
        }

        

      }

      /*=============================================
			Ejecutar funciones globales con respecto a la galería mixta
      =============================================*/
      
      OwlCarouselConfig.fnc();
      CarouselNavigation.fnc();
      SlickConfig.fnc();      
      ProductLightbox.fnc();

      //=======================================
      // funciones de ofertas
      //=======================================
      CountDown.fnc();
      Rating.fnc();      
      ProgressBar.fnc();

    }    
  }
  /*=============================================
	Función que nos avisa cuando finaliza el renderizado de Angular
	=============================================*/
  callbackBestSeller(topSales){
    
    if (this.renderBestSeller) {
      
      this.renderBestSeller = false;
      //capturar cant bloqs
      let topSaleBlock = $(".topSaleBlock");
      let top20Array:Array<any> = [];

      // settimeout por cada segundo de espera
      setTimeout(function(){
        //remover preload
        $(".preload").remove();

        //ciclo por cantidad de bloqees
        for(let i = 0; i < topSaleBlock.length; i++){
          //productos por blok
          top20Array.push(
            topSales.slice(i*topSaleBlock.length, (i*topSaleBlock.length)+topSaleBlock.length)
          )
          //recorrido por el nuevo array
          let f;
          for(f in top20Array[i]){
            
            //si tiene o no oferta
            let price;
						let type;
						let value;
						let offer;
            let offerDate;
            let today = new Date();

						if(top20Array[i][f].offer != ""){

              offerDate = new Date(
                //split averiguar
                parseInt(JSON.parse(top20Array[i][f].offer)[2].split("-")[0]),
                parseInt(JSON.parse(top20Array[i][f].offer)[2].split("-")[1])-1,
                parseInt(JSON.parse(top20Array[i][f].offer)[2].split("-")[2])
        
              )
              if (today < offerDate) { 
      
                type = JSON.parse(top20Array[i][f].offer)[0];
                value = JSON.parse(top20Array[i][f].offer)[1];	

                if(type == "Disccount"){

                  offer = (top20Array[i][f].price - (top20Array[i][f].price * value/100)).toFixed(2)

                }

                if(type == "Fixed"){

                  offer = value
                  
                }

                price = `<p class="ps-product__price sale">$${offer} <del>$${top20Array[i][f].price} </del></p>`;
              }else{
                price =  `<p class="ps-product__price">$${top20Array[i][f].price} </p>`;  
              }
                
						}else{

							price =  `<p class="ps-product__price">$${top20Array[i][f].price} </p>`;

						}
            //mostrar los prods
            $(topSaleBlock[i]).append(
            `<div class="ps-product--horizontal">

                <div class="ps-product__thumbnail">
                  <a href="product/${top20Array[i][f].url}">
                    <img src="assets/img/products/${top20Array[i][f].category}/${top20Array[i][f].image}" alt="" />
                  </a>
                </div>

                <div class="ps-product__content">
                  <a class="ps-product__title" href="product/${top20Array[i][f].url}">
                    ${top20Array[i][f].name}
                  </a>

                  ${price}

                </div>
            </div>`
            )
          }
        }
        //modificar estylo dots
        //$(".owl-dots").css({"bottom":""});
        $(".owl-dot").css({"background": "#ddd"});

      }, topSaleBlock.length*1000)
    }
  }
}
