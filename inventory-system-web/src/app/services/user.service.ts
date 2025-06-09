import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';
import { Observable } from 'rxjs';
import { User } from '@models';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private USER_URI = 'user';

  constructor(
    private webRequestService: WebRequestService,
    private storageService: StorageService
  ) {
  }

  getMyUserId(): number{
    return this.storageService.getUserId();
  }

  getUsers(): Observable<User[]> {
    return this.webRequestService.get(this.USER_URI);
  }

  getUser(userId: number): Observable<User> {
    return this.webRequestService.getWithHeaders(`${this.USER_URI}/${userId}`);
  }

  createUser(user: User): Observable<any> {
    return this.webRequestService.postWithHeaders(this.USER_URI, user);
  }

  updateUser(userId: number, user: User): Observable<any> {
    return this.webRequestService.putWithHeaders(`${this.USER_URI}/${userId}`, user);
  }

  deleteUser(userId: number): Observable<User> {
    return this.webRequestService.deleteWithHeaders(`${this.USER_URI}/${userId}`);
  }

  deleteSelectedUsers(userIds: number[]): Observable<User[]> {
    return this.webRequestService.deleteWithHeaders(this.USER_URI, undefined, userIds);
  }
}
