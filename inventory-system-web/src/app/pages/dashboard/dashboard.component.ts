import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MESSAGE } from '@labels/labels';
import { Functionality } from '@models';
import { ProductService } from '@services';
import { FunctionalityComponent } from '@shared';
import { SegmentedRingChartComponent } from 'src/app/shared/charts/segmented-ring-chart/segmented-ring-chart.component';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, FunctionalityComponent, SegmentedRingChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class Dashboard implements OnInit{
  readonly MESSAGE = MESSAGE;
  readonly NUMBER_OF_LOW_INVENTORY = 5;
  labels = signal<string[]>(null);
  values = signal<number[]>(null);
  aditionalInformation = signal<{label: string, value: any, hexColor?: string}[][]>(null);

  constructor(private productService: ProductService){};

  functionality = signal<Functionality> ({
    label: 'Dashboard',
    icon: 'pi pi-home',
    description: 'Input and output management of inventory products, showing products for low inventory levels.'
  });

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(){
    this.productService.loadInventory(this.NUMBER_OF_LOW_INVENTORY, 'ASC').subscribe({
      next: e => {
        this.labels.set(e?.map(o => o.name));
        this.values.set(e?.map(o => o.stock));
        this.aditionalInformation.set(e?.map(o => [
          {label: 'Reg.', value: o.user.name, hexColor: '#29A7D4'},
          {label: 'Appointment', value: o.user.appointment?.name},
        ]))
      }
    });
  }


}
