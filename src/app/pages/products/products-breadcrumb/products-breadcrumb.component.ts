import { SubCategoriesService } from './../../../services/sub-categories.service';
import { CategoriesService } from './../../../services/categories.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-products-breadcrumb',
  templateUrl: './products-breadcrumb.component.html',
  styleUrls: ['./products-breadcrumb.component.css']
})
export class ProductsBreadcrumbComponent implements OnInit {

  breadcrumb:String = null;

  constructor(private categoriesService:CategoriesService, 
              private subCategoriesService:SubCategoriesService,
              private activatedRoute:ActivatedRoute ) { }

  ngOnInit(): void {
  
    let params = this.activatedRoute.snapshot.params["param"].split("&")[0];
    //filtrar cats
    this.categoriesService.getFilterData("url", params)
    .subscribe(resp =>{

      if (Object.keys(resp).length > 0) {
          
          let i;
          for(i in resp){
          
            this.breadcrumb = resp[i].name;
            let id = Object.keys(resp).toString();
            let value = {
              "view": Number(resp[i].view + 1) 
            }
            this.categoriesService.patchData(id, value)
            .subscribe(resp3 =>{ })
          }

      }
      else{
          //filtrar subcats
          this.subCategoriesService.getFilterData("url", params)
          .subscribe(resp2 =>{

              let i;
              for(i in resp2){
                  this.breadcrumb = resp2[i].name;
                  let id = Object.keys(resp2).toString();
                  let value = {
                    "view": Number(resp2[i].view + 1) 
                  }
                  this.subCategoriesService.patchData(id, value)
                  .subscribe(resp4 =>{ })
              
              }

          })
    
      }

    })
  }

}
