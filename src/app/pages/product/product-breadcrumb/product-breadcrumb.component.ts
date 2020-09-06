import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-product-breadcrumb',
  templateUrl: './product-breadcrumb.component.html',
  styleUrls: ['./product-breadcrumb.component.css']
})
export class ProductBreadcrumbComponent implements OnInit {

  breadcrumb:string = null;
  constructor(private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    // * capturamos param url ============================
    this.breadcrumb = this.activatedRoute.snapshot.params["param"].replace(/[-]/g, " ");   
  }

}
