import { TestBed } from '@angular/core/testing';
import { WebRequestService } from './web-request.service';
import { StorageService } from './storage.service';
import { of } from 'rxjs';

describe('WebRequestService', () => {
  let service: WebRequestService;
  let httpMock: any;
  let storageServiceMock: any;
  const URLBASE = 'http://nexosapi.com';

  beforeEach(() => {
    httpMock = {
      get: jasmine.createSpy('get').and.returnValue(of({})),
      post: jasmine.createSpy('post').and.returnValue(of({})),
      put: jasmine.createSpy('put').and.returnValue(of({})),
      delete: jasmine.createSpy('delete').and.returnValue(of({})),
    };

    storageServiceMock = {
      getUserId: jasmine.createSpy('getUserId').and.returnValue('123'),
    };

    TestBed.configureTestingModule({
      providers: [
        WebRequestService,
        { provide: StorageService, useValue: storageServiceMock },
        { provide: 'HttpClient', useValue: httpMock }
      ]
    });

    service = new WebRequestService(httpMock as any, storageServiceMock);
    service.URLBASE = URLBASE;
  });

  it('should call http.get on get()', () => {
    service.get('testUrl').subscribe();
    expect(httpMock.get).toHaveBeenCalledWith(`${URLBASE}/testUrl`, { params: undefined });
  });

  it('should call http.get with headers on getWithHeaders()', () => {
    service.getWithHeaders('testUrl', { q: '1' }, { 'X-Test': 'abc' }).subscribe();
    expect(httpMock.get).toHaveBeenCalled();
    const args = httpMock.get.calls.mostRecent().args;
    expect(args[0]).toBe(`${URLBASE}/testUrl`);
    expect(args[1].params).toEqual({ q: '1' });
    expect(args[1].headers.get('X-UserId')).toBe('123');
    expect(args[1].headers.get('X-Test')).toBe('abc');
  });

  it('should call http.post on post()', () => {
    const payload = { name: 'foo' };
    service.post('testUrl', payload).subscribe();
    expect(httpMock.post).toHaveBeenCalledWith(`${URLBASE}/testUrl`, payload, { params: undefined });
  });

  it('should call http.post with headers on postWithHeaders()', () => {
    const payload = { name: 'foo' };
    service.postWithHeaders('testUrl', payload, undefined, { 'X-Test': 'abc' }).subscribe();
    const callArgs = httpMock.post.calls.mostRecent().args;
    expect(callArgs[0]).toBe(`${URLBASE}/testUrl`);
    expect(callArgs[1]).toBe(payload);
    expect(callArgs[2].headers.get('X-UserId')).toBe('123');
    expect(callArgs[2].headers.get('X-Test')).toBe('abc');
  });

  it('should call http.put with headers on putWithHeaders()', () => {
    const payload = { name: 'bar' };
    service.putWithHeaders('testUrl', payload, undefined, { 'X-Test': 'abc' }).subscribe();
    const callArgs = httpMock.put.calls.mostRecent().args;
    expect(callArgs[0]).toBe(`${URLBASE}/testUrl`);
    expect(callArgs[1]).toBe(payload);
    expect(callArgs[2].headers.get('X-UserId')).toBe('123');
    expect(callArgs[2].headers.get('X-Test')).toBe('abc');
  });

  it('should call http.delete with headers on deleteWithHeaders()', () => {
    const body = { ids: [1,2] };
    service.deleteWithHeaders('testUrl', undefined, body, { 'X-Test': 'abc' }).subscribe();
    const callArgs = httpMock.delete.calls.mostRecent().args;
    expect(callArgs[0]).toBe(`${URLBASE}/testUrl`);
    expect(callArgs[1].body).toEqual(body);
    expect(callArgs[1].headers.get('X-UserId')).toBe('123');
    expect(callArgs[1].headers.get('X-Test')).toBe('abc');
  });
});
