import { ProductsComponent } from './pages/products/products.component';
import { Error404Component } from './pages/error404/error404.component';
import { SearchComponent } from './pages/search/search.component';
import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from './pages/product/product.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'products/:param', component: ProductsComponent
  },
  {
    path: 'product/:param', component: ProductComponent
  },
  {
    path: 'search/:param', component: SearchComponent
  },
  {
    path: '**', pathMatch: 'full', component: Error404Component
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
