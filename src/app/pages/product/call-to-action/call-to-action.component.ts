import { ProductsService } from '../../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Path } from "../../../config";

@Component({
  selector: 'app-call-to-action',
  templateUrl: './call-to-action.component.html',
  styleUrls: ['./call-to-action.component.css']
})
export class CallToActionComponent implements OnInit {

  path: String = Path.url;
  call_to_action:Array<any> = [];
  price:Array<any> = [];

  constructor(private activatedRoute:ActivatedRoute,
              private productsService:ProductsService) { }

  ngOnInit(): void {
    // *=============================================
    // * para saber params de la url 
      this.productsService.getFilterData('url', 
        this.activatedRoute.snapshot.params["param"]).subscribe(resp =>{
          for(const i in resp){
            this.call_to_action.push(resp[i])

            // ? precio etc ========================
            this.call_to_action.forEach(response=>{
                let type;
                let value;
                let offer;
                
              if (response.offer != "") {
            
                  type = JSON.parse(response.offer)[0];
                  value = JSON.parse(response.offer)[1];
            
                  if (type == "Disccount") {
                    offer = (response.price-(response.price * value/100)).toFixed(2)
                  }
                  if (type == "Fixed") {
                    offer = value;
                  }
                  this.price.push( `<span class="ps-product__price">
                                      <span>$${offer}</span>
                      
                                      <del>$${response.price}</del>
                                    </span>`);
              }else{
                this.price.push( `<span class="ps-product__price">
                                    <span>$${response.price}</span>
                                  </span>`);
              }
            })
            // ?======================================
          }
        })
    // *=============================================


  }

}
