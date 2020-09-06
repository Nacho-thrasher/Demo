import { Component, OnInit, Input } from '@angular/core';
import { Path } from "../../../../config"
import { Quantity, SlickConfig, ProductLightbox, Tabs , ProgressBar ,CountDown ,Rating, DinamicRating, DinamicReviews, DinamicPrice } from "../../../../functions";

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {
  @Input() childItem:any;
  path:String = Path.url;
  rating:Array<any> = [];
  totalReviews:String;
  itemReviews:Array<any> = [];
  render:Boolean = true;

  constructor() { }

  ngOnInit(): void {
    //*========================
    //* rating ================
    this.rating.push(DinamicRating.fnc(this.childItem));
    //*========================
    //* reviews ===============
    let reviews = [];
    reviews.push(DinamicReviews.fnc(this.rating[0]));
    for(let i = 0; i < 5; i++){
        $(".reviewsOption").append(`
          
          <option value="${reviews[0][i]}">${i+1}</option>

        `)
    }
    Rating.fnc();
    //*========================
    //* total reviews =========
    this.totalReviews = JSON.parse(this.childItem["reviews"]).length;
    //*========================
    //* star blocks ===========
    let arrayReviews = [];

    JSON.parse(this.childItem["reviews"]).forEach(rev =>{
      arrayReviews.push(rev.review)  
    })

    arrayReviews.sort();

    let objectStar = {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0
    }

    arrayReviews.forEach((value, index, arr)=>{
       //* tomamos del array completo el primer indice de cada valor 
        let first_index = arr.indexOf(value);
       //* tomamos del array completo el ultimo indice de cada valor 
        let last_index = arr.lastIndexOf(value);

        if (first_index !== last_index) {
          objectStar[value] += 1
        }else{
          objectStar[value] += 1
        }

    })
    //* recorrido por renglones de las estrellas
    for(let i = 5; i > 0; i--){
      let starPercentage = Math.round((objectStar[i]*100)/arrayReviews.length)
      $(".ps-block--average-rating").append(`
      <div class="ps-block__star">

        <span>${i} Star</span>

          <div class="ps-progress" data-value="${starPercentage}">

            <span></span>

          </div>

          <span>${starPercentage}%</span>

      </div>
      `)
    }
    //* enviamos a vista las resenas del prod
    this.itemReviews.push(JSON.parse(this.childItem["reviews"]));

  }
  callback(){
    if (this.render) {
      this.render = true;
    
      let reviews = $("[reviews]");
      for(let i = 0; i < reviews.length; i++){
          for(let r = 0; r < 5; r++){
              $(reviews[i]).append(`
                
                <option value="2">${r+1}</option>
      
              `)
              if ($(reviews[i]).attr("reviews") == (r+1)) {

                $(reviews[i]).children("option").val(1)
              }

          }
      }
      Rating.fnc();

    }
  }

}
