
import { Component, computed, OnInit, signal } from '@angular/core';
import * as ProductActions from "@store/product.actions";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MESSAGE } from '@labels/labels';
import { Product } from '@models';
import { Store } from '@ngrx/store';
import { CryptojsService, ProductService, UserService } from '@services';
import { AppState } from 'src/app/app.reducers';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { FormActionButtonComponent } from '@shared';
import { LoadingComponent } from 'src/app/shared/loading/loading.component';

@Component({
  selector: 'app-product',
  imports: [CommonModule, InputTextModule, ReactiveFormsModule, ButtonModule,DatePickerModule, FormActionButtonComponent, LoadingComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {
  MESSAGE = MESSAGE;

  productForm !: FormGroup;
  product = signal<Product>(null);
  updateMode = signal<boolean>(false);
  creatingOrUpdating = signal<boolean>(false);
  deleting = signal<boolean>(false);
  loading = signal<boolean>(false);
  myUserId = signal<number>(null);
  showDeleteButton = computed(() => this.updateMode() && this.myUserId() == this.product()?.userId);
  today = signal<Date>(new Date());

  constructor(
    private store: Store<AppState>,
    private productService: ProductService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cryptoService: CryptojsService
  ){}

  ngOnInit(): void {
    this.myUserId.set(this.userService.getMyUserId());
    this.loadProduct(this.cryptoService.decryptParamAsNumber(this.route.snapshot.params['id']));
    this.buildForm();
  }

  buildForm(){
    this.productForm = this.formBuilder.group({
      name: [null, Validators.required],
      entryDate: [null, Validators.compose([
        Validators.required
      ])],
      stock: [null, Validators.compose([
        Validators.required, Validators.min(0)
      ])]
    })
  }

  loadProduct(id: number){
    if (id == undefined){
      this.updateMode.set(false);
    }else{
      this.loading.set(true);
      this.productService.getProduct(id).subscribe({
        next: (e) => {
          this.product.set(e);
          this.assignValuesToForm();
          this.loading.set(false);
        },
        error:() => this.loading.set(false)
      });
      this.updateMode.set(true);
    }
  }

  assignValuesToForm(){
    this.productForm.get('name').setValue(this.product().name);
    this.productForm.get('stock').setValue(this.product().stock);
    this.productForm.get('entryDate').setValue(this.product().entryDate ? new Date(this.product().entryDate) : null);
  }

  updateProduct(payload: Product, productId: number): void {
    this.productService.updateProduct(productId, payload).subscribe({
      next: (e) => {
        this.creatingOrUpdating.set(false);
        this.store.dispatch(ProductActions.updateFromList({product: e}));
        this.goBack();
      },
      error: () => this.creatingOrUpdating.set(false)
    });
  }

  createProduct(payload: Product): void {
    this.productService.createProduct(payload).subscribe({
      next: (e) => {
        this.creatingOrUpdating.set(false);
        this.store.dispatch(ProductActions.addToList({product: e}));
        this.goBack();
      },
      error: () => this.creatingOrUpdating.set(false)
    });
  }

  onSubmitProduct(event : Event): void {
    event.preventDefault();
    let payload = {...this.product, ...this.productForm.value, userId: this.myUserId()};
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
    } else {
      this.creatingOrUpdating.set(true);
      this.updateMode() ? this.updateProduct(payload, this.product().productId) : this.createProduct(payload);
    }
  }

  onDeleteProduct(event : Event): void {
    event.preventDefault();
    const productId = this.product().productId;
    this.deleting.set(true);
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        this.deleting.set(false);
        this.store.dispatch(ProductActions.removeFromList({id: productId}));
        this.goBack();
      },
      error: () => this.deleting.set(false),
    });
  }

  goBack(): void {
    this.router.navigate(['management/products']);
  }
}
