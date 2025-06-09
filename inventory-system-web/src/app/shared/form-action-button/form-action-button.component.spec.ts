import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormActionButtonComponent } from './form-action-button.component';
import { By } from '@angular/platform-browser';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog.service';

@Component({
  standalone: true,
  selector: 'app-test-host',
  template: `
    <app-form-action-button
      [updateMode]="updateMode"
      [showDeleteButton]="showDelete"
      [creatingOrUpdating]="loading"
      [deleting]="deleting"
      [disabledCreateOrUpdateButton]="disabled"
      [buttonCreateNamedAs]="createLabel"
      [buttonCancelNamedAs]="cancelLabel"
      [deleteMessage]="deleteMsg"
      (createOrUpdate)="onCreateOrUpdate($event)"
      (cancel)="onCancel($event)"
      (delete)="onDelete($event)"
    />
  `,
  imports: [FormActionButtonComponent]
})
class TestHostComponent {
  updateMode = false;
  showDelete = false;
  loading = false;
  deleting = false;
  disabled = false;
  createLabel = 'Save';
  cancelLabel = 'Cancel';
  deleteMsg = 'Are you sure to delete the register?';

  onCreateOrUpdate = jasmine.createSpy('onCreateOrUpdate');
  onCancel = jasmine.createSpy('onCancel');
  onDelete = jasmine.createSpy('onDelete');
}

describe('FormActionButtonComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let confirmationDialogServiceSpy: jasmine.SpyObj<ConfirmationDialogService>;

  beforeEach(async () => {
    confirmationDialogServiceSpy = jasmine.createSpyObj('ConfirmationDialogService', ['showDeleteConfirmationDialog']);

    await TestBed.configureTestingModule({
      providers: [
        { provide: ConfirmationDialogService, useValue: confirmationDialogServiceSpy }
      ],
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the host component', () => {
    expect(host).toBeTruthy();
  });

  it('should render create and cancel buttons', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).toBe(2); 
  });

  it('should render delete button when showDelete is true', () => {
    host.showDelete = true;
    fixture.detectChanges();
    const deleteBtn = fixture.debugElement.query(By.css('button.p-button-danger'));
    expect(deleteBtn).toBeTruthy();
  });

  it('should emit createOrUpdate on submit button click', () => {
    const createBtn = fixture.debugElement.query(By.css('button.p-button-success'));
    createBtn.nativeElement.click();
    fixture.detectChanges();

    expect(host.onCreateOrUpdate).toHaveBeenCalled();
  });

  it('should emit cancel on cancel button click', () => {
    const cancelBtn = fixture.debugElement.query(By.css('button.p-button-secondary'));
    cancelBtn.nativeElement.click();
    fixture.detectChanges();

    expect(host.onCancel).toHaveBeenCalled();
  });

  it('should call confirmation dialog and emit delete on confirmation', () => {
    host.showDelete = true;
    fixture.detectChanges();

    confirmationDialogServiceSpy.showDeleteConfirmationDialog.and.callFake((cb) => cb());

    const deleteBtn = fixture.debugElement.query(By.css('button.p-button-danger'));
    deleteBtn.nativeElement.click();
    fixture.detectChanges();

    expect(confirmationDialogServiceSpy.showDeleteConfirmationDialog).toHaveBeenCalled();
    expect(host.onDelete).toHaveBeenCalled();
  });

  it('should disable buttons when loading or deleting', () => {
    host.loading = true;
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    buttons.forEach(btn => {
      expect(btn.nativeElement.disabled).toBeTrue();
    });

    host.loading = false;
    host.deleting = true;
    fixture.detectChanges();

    buttons.forEach(btn => {
      expect(btn.nativeElement.disabled).toBeTrue();
    });
  });

  it('should show spinner icon when deleting', () => {
    host.showDelete = true;
    host.deleting = true;
    fixture.detectChanges();

    const deleteBtn = fixture.debugElement.query(By.css('button.p-button-danger'));
    expect(deleteBtn.nativeElement.innerHTML).toContain('pi-spin');
  });

  it('should show "Update" when updateMode is true', () => {
    host.updateMode = true;
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('button.p-button-success span')).nativeElement;
    expect(label.textContent.trim()).toBe('Update');
  });

  it('should render custom labels for create and cancel', () => {
    fixture.detectChanges();

    const createLabel = fixture.debugElement.query(By.css('button.p-button-success span')).nativeElement;
    const cancelLabel = fixture.debugElement.query(By.css('button.p-button-secondary span')).nativeElement;

    expect(createLabel.textContent.trim()).toBe('Save');
    expect(cancelLabel.textContent.trim()).toBe('Cancel');
  });
});
