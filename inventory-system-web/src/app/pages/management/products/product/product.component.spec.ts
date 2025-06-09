import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductComponent } from './product.component';
import { ConfirmationDialogService, CryptojsService, ProductService, UserService } from '@services';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { FormActionButtonComponent } from '@shared';
import { LoadingComponent } from 'src/app/shared/loading/loading.component';
import { of } from 'rxjs';
import { Product } from '@models';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let cryptoServiceSpy: jasmine.SpyObj<CryptojsService>;
  let confirmationDialogServiceSpy: jasmine.SpyObj<ConfirmationDialogService>;
  let storeSpy: jasmine.SpyObj<Store<any>>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteStub: any;

  beforeEach(async () => {
    productServiceSpy = jasmine.createSpyObj('ProductService', ['getProduct', 'createProduct', 'updateProduct', 'deleteProduct']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getMyUserId']);
    cryptoServiceSpy = jasmine.createSpyObj('CryptojsService', ['decryptParamAsNumber']);
    confirmationDialogServiceSpy = jasmine.createSpyObj('ConfirmationDialogService', ['showDeleteConfirmationDialog']);
    storeSpy = jasmine.createSpyObj('Store', ['dispatch']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteStub = {
      snapshot: {
        params: of({id: 1}),
        queryParams: of({})
      },
    };

    await TestBed.configureTestingModule({
      imports: [ProductComponent, CommonModule, InputTextModule, 
        ReactiveFormsModule, ButtonModule, DatePickerModule, 
        FormActionButtonComponent, LoadingComponent],
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

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;

    productServiceSpy.getProduct.and.returnValue(of({} as Product));
    productServiceSpy.updateProduct.and.returnValue(of({} as Product));
    productServiceSpy.deleteProduct.and.returnValue(of({} as Product));
    confirmationDialogServiceSpy.showDeleteConfirmationDialog.and.callFake((callback: Function) => {
      callback();
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadProduct and assign Values To Form', () => {
    component.loadProduct(1);
    expect(productServiceSpy.getProduct).toHaveBeenCalledWith(1);
    component.assignValuesToForm();
  });
});

