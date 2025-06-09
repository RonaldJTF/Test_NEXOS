import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { WebRequestService } from './web-request.service';
import { of } from 'rxjs';
import { Product } from '@models';

describe('ProductService', () => {
  let service: ProductService;
  let webRequestServiceSpy: jasmine.SpyObj<WebRequestService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('WebRequestService', [
      'getWithHeaders',
      'postWithHeaders',
      'putWithHeaders',
      'deleteWithHeaders',
    ]);

    TestBed.configureTestingModule({
      providers: [
        ProductService,
        { provide: WebRequestService, useValue: spy },
      ],
    });

    service = TestBed.inject(ProductService);
    webRequestServiceSpy = TestBed.inject(WebRequestService) as jasmine.SpyObj<WebRequestService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call postWithHeaders for getPagedProducts', () => {
    const request = { page: 1, size: 10 };
    webRequestServiceSpy.postWithHeaders.and.returnValue(of({}));

    service.getPagedProducts(request).subscribe();
    expect(webRequestServiceSpy.postWithHeaders).toHaveBeenCalledWith('product/paged', request);
  });

  it('should call getWithHeaders for getProducts', () => {
    const expected: Product[] = [];
    webRequestServiceSpy.getWithHeaders.and.returnValue(of(expected));

    service.getProducts().subscribe();
    expect(webRequestServiceSpy.getWithHeaders).toHaveBeenCalledWith('product');
  });

  it('should call getWithHeaders for getProduct', () => {
    const productId = 123;
    const expected: Product = { productId: productId, name: 'Test Product' } as Product;
    webRequestServiceSpy.getWithHeaders.and.returnValue(of(expected));

    service.getProduct(productId).subscribe();
    expect(webRequestServiceSpy.getWithHeaders).toHaveBeenCalledWith(`product/${productId}`);
  });

  it('should call postWithHeaders for createProduct', () => {
    const payload: Product = { productId: 0, name: 'New Product' } as Product;
    webRequestServiceSpy.postWithHeaders.and.returnValue(of({}));

    service.createProduct(payload).subscribe();
    expect(webRequestServiceSpy.postWithHeaders).toHaveBeenCalledWith('product', payload);
  });

  it('should call putWithHeaders for updateProduct', () => {
    const productId = 5;
    const payload: Product = { productId: productId, name: 'Updated' } as Product;
    webRequestServiceSpy.putWithHeaders.and.returnValue(of({}));

    service.updateProduct(productId, payload).subscribe();
    expect(webRequestServiceSpy.putWithHeaders).toHaveBeenCalledWith(`product/${productId}`, payload);
  });

  it('should call deleteWithHeaders for deleteProduct', () => {
    const productId = 42;
    webRequestServiceSpy.deleteWithHeaders.and.returnValue(of({}));

    service.deleteProduct(productId).subscribe();
    expect(webRequestServiceSpy.deleteWithHeaders).toHaveBeenCalledWith(`product/${productId}`);
  });

  it('should call deleteWithHeaders for deleteSelectedProducts with payload', () => {
    const ids = [1, 2, 3];
    webRequestServiceSpy.deleteWithHeaders.and.returnValue(of([]));

    service.deleteSelectedProducts(ids).subscribe();
    expect(webRequestServiceSpy.deleteWithHeaders).toHaveBeenCalledWith('product', undefined, ids);
  });

  it('should call getWithHeaders for loadInventory', () => {
    const limit = 1;
    const sortDirection = 'ASC';
    const expected: Product[] = [{ productId: 1, name: 'Test Product' }] as Product[];

    webRequestServiceSpy.getWithHeaders.and.returnValue(of(expected));

    service.loadInventory(limit, sortDirection).subscribe();
    expect(webRequestServiceSpy.getWithHeaders).toHaveBeenCalledWith(`product/inventory`, {sortDirection, limit});
  });
});
