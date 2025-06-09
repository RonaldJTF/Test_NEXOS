import { Routes } from '@angular/router';
import { Products } from './products.component';
import { ProductsList } from './products-list/products-list.component';
import { ProductComponent } from './product/product.component';

export default [
    { path: '', component: Products, children: [
        { path: '', component: ProductsList },
        { path: 'create', component: ProductComponent },
        { path: ':id', component: ProductComponent },
    ]}
] as Routes;
