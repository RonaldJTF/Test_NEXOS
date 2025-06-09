import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashboard } from './dashboard.component';
import { ProductService } from '@services';
import { SegmentedRingChartComponent } from 'src/app/shared/charts/segmented-ring-chart/segmented-ring-chart.component';
import { FunctionalityComponent } from '@shared';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  let productServiceSpy: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', ['loadInventory']);

    await TestBed.configureTestingModule({
      imports: [Dashboard, RouterModule, FunctionalityComponent, SegmentedRingChartComponent],
      declarations: [],
      providers: [
        { provide: ProductService, useValue: productServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;

    productServiceSpy.loadInventory.and.returnValue(of([]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadProduct and assign Values To Form', () => {
    component.loadInventory();
    expect(productServiceSpy.loadInventory).toHaveBeenCalledWith(5, 'ASC');
  });
});

