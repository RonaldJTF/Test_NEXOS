import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Observable } from 'rxjs';
import { Product } from '@models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private PRODUCT_URI = 'product';

  constructor(
    private webRequestService: WebRequestService
  ) {
  }

  getPagedProducts(request: any): Observable<any> {
    return this.webRequestService.postWithHeaders(`${this.PRODUCT_URI}/paged`, request);
  }

  getProducts(): Observable<Product[]> {
    return this.webRequestService.getWithHeaders(this.PRODUCT_URI);
  }

  getProduct(productId: number): Observable<Product> {
    return this.webRequestService.getWithHeaders(`${this.PRODUCT_URI}/${productId}`);
  }

  createProduct(payload: Product): Observable<any> {
    return this.webRequestService.postWithHeaders(this.PRODUCT_URI, payload);
  }

  updateProduct(productId: number, payload: Product): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.PRODUCT_URI}/${productId}`, payload);
  }

  deleteProduct(productId: number): Observable<Product> {
    return this.webRequestService.deleteWithHeaders(`${this.PRODUCT_URI}/${productId}`);
  }

  deleteSelectedProducts(payload: number[]): Observable<Product[]> {
    return this.webRequestService.deleteWithHeaders(this.PRODUCT_URI, undefined, payload);
  }

  loadInventory(limit: number, sortDirection: 'ASC' | 'DESC'): Observable<Product[]>{
    return this.webRequestService.getWithHeaders(`${this.PRODUCT_URI}/inventory`, {sortDirection: sortDirection, limit: limit});
  }
}
