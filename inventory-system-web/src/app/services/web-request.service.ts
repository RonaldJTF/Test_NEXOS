import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WebRequestService {

  URLBASE: string = environment.URLAPI;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  get(url: string, params?: any): Observable<any> {
    return this.http.get<any>(`${this.URLBASE}/${url}`, {
      params: params,
    });
  }

  getWithHeaders(url: string, params?: any, headers?: any, otherOptions?: any): Observable<any> {
    return this.http.get<any>(`${this.URLBASE}/${url}`, {
      ...(otherOptions ?? {}),
      params: params,
      headers: new HttpHeaders({
        ...headers,
        'X-UserId': this.storageService.getUserId(),
      }),
    });
  }

  post(url: string, payload: any, params?: any): Observable<any> {
    return this.http.post<any>(`${this.URLBASE}/${url}`, payload, {
      params: params,
    });
  }

  postWithHeaders(
    url: string,
    payload: any,
    params?: any,
    headers?: any
  ): Observable<any> {
    return this.http.post<any>(`${this.URLBASE}/${url}`, payload, {
      params: params,
      headers: new HttpHeaders({
        ...headers,
        'X-UserId': this.storageService.getUserId(),
      }),
    });
  }

  putWithHeaders(
    url: string,
    payload: any,
    params?: any,
    headers?: any
  ): Observable<any> {
    return this.http.put<any>(`${this.URLBASE}/${url}`, payload, {
      params: params,
      headers: new HttpHeaders({
        ...headers,
        'X-UserId': this.storageService.getUserId(),
      }),
    });
  }

  deleteWithHeaders(
    url: string,
    params?: any,
    body?: any,
    headers?: any
  ): Observable<any> {
    return this.http.delete<any>(`${this.URLBASE}/${url}`, {
      params: params,
      body: body,
      headers: new HttpHeaders({
        ...headers,
        'X-UserId': this.storageService.getUserId(),
      }),
    });
  }
}
