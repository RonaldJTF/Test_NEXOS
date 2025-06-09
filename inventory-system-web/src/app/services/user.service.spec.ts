import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { WebRequestService } from './web-request.service';
import { StorageService } from './storage.service';
import { of } from 'rxjs';
import { User } from '@models';

describe('UserService', () => {
  let service: UserService;
  let webRequestSpy: jasmine.SpyObj<WebRequestService>;
  let storageSpy: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    const webRequestMock = jasmine.createSpyObj('WebRequestService', [
      'get',
      'getWithHeaders',
      'postWithHeaders',
      'putWithHeaders',
      'deleteWithHeaders'
    ]);

    const storageMock = jasmine.createSpyObj('StorageService', ['getUserId']);

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: WebRequestService, useValue: webRequestMock },
        { provide: StorageService, useValue: storageMock },
      ],
    });

    service = TestBed.inject(UserService);
    webRequestSpy = TestBed.inject(WebRequestService) as jasmine.SpyObj<WebRequestService>;
    storageSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get user ID from storage service', () => {
    storageSpy.getUserId.and.returnValue(101);
    const userId = service.getMyUserId();
    expect(userId).toBe(101);
    expect(storageSpy.getUserId).toHaveBeenCalled();
  });

  it('should fetch users using webRequestService.get', () => {
    const mockUsers: User[] = [];
    webRequestSpy.get.and.returnValue(of(mockUsers));
    service.getUsers().subscribe();
    expect(webRequestSpy.get).toHaveBeenCalledWith('user');
  });

  it('should fetch a single user using getWithHeaders', () => {
    const userId = 55;
    const mockUser = { userId: userId, name: 'Test' } as User;
    webRequestSpy.getWithHeaders.and.returnValue(of(mockUser));
    service.getUser(userId).subscribe();
    expect(webRequestSpy.getWithHeaders).toHaveBeenCalledWith(`user/${userId}`);
  });

  it('should create a user using postWithHeaders', () => {
    const newUser = { name: 'New User' } as User;
    webRequestSpy.postWithHeaders.and.returnValue(of({}));
    service.createUser(newUser).subscribe();
    expect(webRequestSpy.postWithHeaders).toHaveBeenCalledWith('user', newUser);
  });

  it('should update a user using putWithHeaders', () => {
    const userId = 7;
    const updatedUser = { userId: userId, name: 'Updated' } as User;
    webRequestSpy.putWithHeaders.and.returnValue(of({}));
    service.updateUser(userId, updatedUser).subscribe();
    expect(webRequestSpy.putWithHeaders).toHaveBeenCalledWith(`user/${userId}`, updatedUser);
  });

  it('should delete a user using deleteWithHeaders', () => {
    const userId = 10;
    webRequestSpy.deleteWithHeaders.and.returnValue(of({}));
    service.deleteUser(userId).subscribe();
    expect(webRequestSpy.deleteWithHeaders).toHaveBeenCalledWith(`user/${userId}`);
  });

  it('should delete selected users using deleteWithHeaders with payload', () => {
    const ids = [1, 2, 3];
    webRequestSpy.deleteWithHeaders.and.returnValue(of([]));
    service.deleteSelectedUsers(ids).subscribe();
    expect(webRequestSpy.deleteWithHeaders).toHaveBeenCalledWith('user', undefined, ids);
  });
});
