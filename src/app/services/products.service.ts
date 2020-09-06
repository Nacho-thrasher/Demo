import { HttpClient } from '@angular/common/http';
import { Api } from "../config";
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private api:string = Api.url;

  constructor(private http: HttpClient) { }

  getData(){
    return this.http.get(`${this.api}products.json`);
  }
  getLimiData(startAt:String, limitToFirst:Number){
    return this.http.get(`${this.api}products.json?orderBy="$key"&limitToFirst=${limitToFirst}&startAt="${startAt}"&print=pretty`);
  }
  getFilterData(orderBy:String, equalTo:string){
		return this.http.get(`${this.api}products.json?orderBy="${orderBy}"&equalTo="${equalTo}"&print=pretty`);
  }
  getFilterDataWithLimit(orderBy:String, equalTo:String, limitToFirst:Number){
		return this.http.get(`${this.api}products.json?orderBy="${orderBy}"&equalTo="${equalTo}"&limitToFirst=${limitToFirst}&print=pretty`);
  }
  getSearchData(orderBy:String, param:String){
    return this.http.get(`${this.api}products.json?orderBy="${orderBy}"&startAt="${param}"&endAt="${param}\uf8ff"&print=pretty`);
  }
}
