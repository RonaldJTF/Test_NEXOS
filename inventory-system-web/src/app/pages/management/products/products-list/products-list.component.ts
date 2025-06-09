import { Component, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import * as ProductActions from "@store/product.actions";
import { Product } from '@models';
import { ConfirmationDialogService, CryptojsService, ProductService, UserService } from '@services';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MESSAGE} from "@labels/labels";
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { OverlayModule } from 'primeng/overlay';
import { TieredMenu } from 'primeng/tieredmenu';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { TimeAgoPipe } from 'src/app/pipes/time-ago/time-ago.pipe';
import { Ripple } from 'primeng/ripple';
import { LoadingComponent } from 'src/app/shared/loading/loading.component';

@Component({
  selector: 'app-products-list',
  imports: [
    TableModule, CommonModule, FormsModule, 
    ButtonModule, IconField, InputTextModule, 
    TooltipModule, OverlayModule, TieredMenu, 
    BadgeModule, TimeAgoPipe, Ripple, LoadingComponent],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
})
export class ProductsList implements OnInit, OnDestroy {
  dt = viewChild<Table>('dt');

  readonly MESSAGE = MESSAGE;
  products = signal<Product[]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(false);
  myUserId = signal<number>(null); 

  globalSearchValue = '';
  selectedProducts: Product[] = [];

  private productsSubscription: Subscription;

  columns = [
    {field: 'name', header: 'Producto', sortable: true, searchable: true},
    {field: 'stock', header: 'Stock', sortable: true, searchable: true},
    {field: 'user.name', header: 'User', sortable: true, searchable: true},
    {field: 'entryDate', header: 'Date', sortable: true, searchable: false},
  ];

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private cryptoService: CryptojsService,
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  get hasDisabledProducts(): boolean {
    return this.products().some(p => p['disabled']);
  }

  getDisabled(product: Product): boolean{
    return this.myUserId() != product.userId;
  }

  ngOnInit(): void {
    this.myUserId.set(this.userService.getMyUserId());
    this.productsSubscription = this.store.select(e => e.product.items).subscribe( e => {
      this.products.set(e?.map(prod => {
        const disabled = this.getDisabled(prod);
        const items: MenuItem[] = [
          { label: 'Edit', icon: 'pi pi-pencil', command: e => this.onGoToUpdate(prod.productId, e.originalEvent) },
          { label: 'Delete', icon: 'pi pi-trash', visible: !disabled, command: e => this.onDeleteProduct(prod.productId, e.originalEvent) },
        ];
        return {...prod, items, disabled: disabled};
      }));
    });
  }

  ngOnDestroy(): void {
      this.productsSubscription?.unsubscribe();
  }

  loadInventoryLazy(event: TableLazyLoadEvent) {
    this.loading.set(true);
    const columnIndexMap: Record<string, number> = this.columns.reduce(
      (acc, col, idx) => ({ ...acc, [col.field]: idx }),
      {}
    );

    const request = {
      draw: 1,
      start: event.first ?? 0,
      length: event.rows ?? 10,
      search: {
        value: event.globalFilter ?? '',
        regex: false
      },
      order: (event.multiSortMeta || []).map(sort => ({
        column: columnIndexMap[sort.field] ?? 0,
        dir: sort.order === 1 ? 'asc' : 'desc'
      })),
      columns: this.columns.map(col => ({
        data: col.field,
        name: '',
        searchable: col.searchable,
        orderable: col.sortable,
        search: { value: '', regex: false }
      }))
    };

    this.productService.getPagedProducts(request).subscribe(data => {
      this.store.dispatch(ProductActions.setList({products: data.data}))
      this.totalRecords.set(data.recordsTotal);
      this.loading.set(false);
    });
  }

  onGlobalFilter(event: Event, dt: any) {
    const input = event.target as HTMLInputElement;
    dt.filterGlobal(input.value, 'contains');
  }

  getSeverity(stock: number) {
    if(stock < 5){
      return {label: 'slow', color: 'red'}
    }else if(stock >= 5 && stock <= 10){
      return {label: 'medium', color: 'yellow'}
    }else if(stock > 10){
      return {label: 'hight', color: 'green'}
    }else{
      return {};
    }
  }

  openNew() {
    this.router.navigate(['create'], { relativeTo: this.route});
  }

  onGoToUpdate (productId : any, event: Event): void{
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate([this.cryptoService.encryptParam(productId)], {relativeTo: this.route})
  }

   onDeleteProduct(productId : any, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.productService.deleteProduct(productId)
        .subscribe({
          next: () => {
            //this.store.dispatch(ProductActions.removeFromList({id: productId}));
            this.dt().reset();
            this.desmarkAll();
          }
        });
      }
    )
  }


  deleteSelectedProducts() {
    let productIds: number[] = this.selectedProducts.map(item => item.productId);
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.productService.deleteSelectedProducts(productIds)
        .subscribe({
          next: (e) => {
           //this.store.dispatch(ProductActions.removeItemsFromList({productIds: productIds}));
           this.dt().reset();
           this.desmarkAll();
          }
        });
      }
    )
  }

  desmarkAll() {
    this.selectedProducts = [];
  }
}