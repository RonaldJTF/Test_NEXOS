import { TestBed } from '@angular/core/testing';
import { ConfirmationDialogService } from './confirmation-dialog.service';
import { ConfirmationService } from 'primeng/api';

describe('ConfirmationDialogService', () => {
  let service: ConfirmationDialogService;
  let confirmationServiceSpy: jasmine.SpyObj<ConfirmationService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ConfirmationService', ['confirm']);

    TestBed.configureTestingModule({
      providers: [
        ConfirmationDialogService,
        { provide: ConfirmationService, useValue: spy }
      ]
    });

    service = TestBed.inject(ConfirmationDialogService);
    confirmationServiceSpy = TestBed.inject(ConfirmationService) as jasmine.SpyObj<ConfirmationService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call confirm with correct config in showDeleteConfirmationDialog', () => {
    const acceptAction = jasmine.createSpy('acceptAction');
    service.showDeleteConfirmationDialog(acceptAction);
    expect(confirmationServiceSpy.confirm).toHaveBeenCalledWith(jasmine.objectContaining({
      key: 'generalConfirmDialog',
      message: 'Are you sure you want to delete the record?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
    }));

    const config = confirmationServiceSpy.confirm.calls.mostRecent().args[0];
    config.accept();
    expect(acceptAction).toHaveBeenCalled();
  });

  it('should call confirm with a custom message in showDeleteConfirmationDialog', () => {
    const acceptAction = jasmine.createSpy('acceptAction');
    service.showDeleteConfirmationDialog(acceptAction, 'Delete this item?');
    expect(confirmationServiceSpy.confirm).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'Delete this item?'
    }));
  });

  it('should call both accept and reject actions in showEventConfirmationDialog', () => {
    const acceptAction = jasmine.createSpy('acceptAction');
    const rejectAction = jasmine.createSpy('rejectAction');
    service.showEventConfirmationDialog('Confirm event', acceptAction, rejectAction);
    const config = confirmationServiceSpy.confirm.calls.mostRecent().args[0];

    expect(config.message).toBe('Confirm event');
    config.accept();

    expect(acceptAction).toHaveBeenCalled();

    config.reject();
    expect(rejectAction).toHaveBeenCalled();
  });

  it('should not throw if rejectAction is undefined in showEventConfirmationDialog', () => {
    const acceptAction = jasmine.createSpy('acceptAction');
    service.showEventConfirmationDialog('Confirm without reject', acceptAction);
    const config = confirmationServiceSpy.confirm.calls.mostRecent().args[0];
    expect(() => config.reject()).not.toThrow();
  });
});
