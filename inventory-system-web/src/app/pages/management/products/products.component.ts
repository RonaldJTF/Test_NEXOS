import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Functionality } from '@models';
import { FunctionalityComponent } from '@shared';

@Component({
  selector: 'app-products',
  imports: [RouterModule, FunctionalityComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class Products {
  functionality = signal<Functionality> ({
    label: 'Products',
    icon: 'pi pi-truck',
    description: 'Input and output management of inventory products'
  });
}
