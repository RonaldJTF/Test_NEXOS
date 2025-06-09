import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsList } from './products-list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, UserService, CryptojsService, ConfirmationDialogService } from '@services';
import { TimeAgoPipe } from 'src/app/pipes/time-ago/time-ago.pipe';
import { LoadingComponent } from 'src/app/shared/loading/loading.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { OverlayModule } from 'primeng/overlay';
import { TieredMenu, TieredMenuModule } from 'primeng/tieredmenu';
import { BadgeModule } from 'primeng/badge';
import { Ripple } from 'primeng/ripple';
import { Store } from '@ngrx/store';
import { signal } from '@angular/core';
import { IconField } from 'primeng/iconfield';
import { of } from 'rxjs';
import { Product } from '@models';

describe('ProductsList', () => {
  let component: ProductsList;
  let fixture: ComponentFixture<ProductsList>;

  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let cryptoServiceSpy: jasmine.SpyObj<CryptojsService>;
  let confirmationDialogServiceSpy: jasmine.SpyObj<ConfirmationDialogService>;
  let storeSpy: jasmine.SpyObj<Store<any>>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteStub: any;

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', ['getPagedProducts', 'deleteProduct', 'deleteSelectedProducts']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getMyUserId']);
    cryptoServiceSpy = jasmine.createSpyObj('CryptojsService', ['encryptParam']);
    confirmationDialogServiceSpy = jasmine.createSpyObj('ConfirmationDialogService', ['showDeleteConfirmationDialog']);
    storeSpy = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteStub = {
      snapshot: {},
      params: of({}),
      queryParams: of({})
    };

    await TestBed.configureTestingModule({
      imports: [ProductsList, TableModule, CommonModule, FormsModule, 
          ButtonModule, IconField, InputTextModule, 
          TooltipModule, OverlayModule, TieredMenu, 
          BadgeModule, TimeAgoPipe, Ripple, LoadingComponent],
      declarations: [],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: CryptojsService, useValue: cryptoServiceSpy },
        { provide: ConfirmationDialogService, useValue: confirmationDialogServiceSpy},
        { provide: Store, useValue: storeSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsList);
    component = fixture.componentInstance;
    component.dt = signal({
      reset: jasmine.createSpy('reset')
    } as unknown as Table);

    storeSpy.select.and.returnValue(of({}));
    productServiceSpy.getPagedProducts.and.returnValue(of([]));
    productServiceSpy.deleteProduct.and.returnValue(of({} as Product));
    productServiceSpy.deleteSelectedProducts.and.returnValue(of([]));
    confirmationDialogServiceSpy.showDeleteConfirmationDialog.and.callFake((callback: Function) => {
      callback();
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadInventoryLazy and fetch paged products', () => {
    component.loadInventoryLazy({ first: 0, rows: 10, globalFilter: 'test', multiSortMeta: [] });
    expect(productServiceSpy.getPagedProducts).toHaveBeenCalled();
    expect(storeSpy.dispatch).toHaveBeenCalled();
  });

  it('should call onDeleteProduct and reset the table', () => {
    component.onDeleteProduct(1, new Event('click'));
    expect(confirmationDialogServiceSpy.showDeleteConfirmationDialog).toHaveBeenCalled();
    expect(productServiceSpy.deleteProduct).toHaveBeenCalledWith(1);
    expect(component.dt().reset).toHaveBeenCalled();
  });

  it('should delete selected products and reset table', () => {
    component.selectedProducts = [{ productId: 123 }] as any;
    component.deleteSelectedProducts();
    expect(confirmationDialogServiceSpy.showDeleteConfirmationDialog).toHaveBeenCalled();
    expect(productServiceSpy.deleteSelectedProducts).toHaveBeenCalledWith([123]);
    expect(component.dt().reset).toHaveBeenCalled();
  });
});
