import { ProductsService } from './../../../services/products.service';
import { Component, OnInit } from '@angular/core';
import { Path } from "../../../config";
import { OwlCarouselConfig, BackgroundImage } from "../../../functions";

@Component({
  selector: 'app-home-banner',
  templateUrl: './home-banner.component.html',
  styleUrls: ['./home-banner.component.css']
})
export class HomeBannerComponent implements OnInit {

  path = Path.url;
  banner_home:Array<any> = [];
  category:Array<any> = [];
  url:Array<any> = [];
  render:Boolean = true;
  preload:Boolean = false;

  constructor(private productsService:ProductsService) { }

  ngOnInit(): void {
    
    this.preload = true;
    let index = 0;

    this.productsService.getData().subscribe(resp =>{
      let i; let size = 0;
      for(i in resp){
        size++;
      }
      //number aleatory
      if (size > 5 ) {
        index = Math.floor(Math.random()*(size-5));
      }
      //limits
      this.productsService.getLimiData(Object.keys(resp)[index], 5).subscribe(resp =>{
        let i;
        for(i in resp){
          this.banner_home.push(JSON.parse(resp[i].horizontal_slider))
          this.category.push(resp[i].category)
          this.url.push(resp[i].url)                         
          this.preload = false;
        }
      })
    })
  }
  //preload
  callback(){
    if (this.render) {
      this.render = false;
      OwlCarouselConfig.fnc();
      BackgroundImage.fnc();
    }
  }

}
