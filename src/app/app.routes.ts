import { Routes } from '@angular/router';
import { ProductFormComponent } from './feature/product/product-form/product-form.component';
import { ProductListComponent } from './feature/product/product-list/product-list.component';

export const routes: Routes = [

  {
    path: 'product-list',
    component: ProductListComponent
  },

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'product-list'
  }
  
];