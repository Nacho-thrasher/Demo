import { ProductsService } from './../../../services/products.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-product-breadcrumb',
  templateUrl: './product-breadcrumb.component.html',
  styleUrls: ['./product-breadcrumb.component.css']
})
export class ProductBreadcrumbComponent implements OnInit {

  breadcrumb:string = null;
  
  constructor(private activatedRoute:ActivatedRoute,
              private productsService:ProductsService) { }

  ngOnInit(): void {
    // * capturamos param url ============================
    this.breadcrumb = this.activatedRoute.snapshot.params["param"].replace(/[-]/g, " ");   

    this.productsService.getFilterData("url", this.activatedRoute.snapshot.params["param"])
      .subscribe(resp=>{
      for(const i in resp){

        let id = Object.keys(resp).toString();
        
        let value = {
          "views": Number(resp[i].views+1)
        }

        this.productsService.patchData(id, value)
        .subscribe(resp=>{})
  
      }
    })

  }

}
