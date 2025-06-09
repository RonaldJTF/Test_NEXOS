import { CommonModule } from '@angular/common';
import { booleanAttribute, Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog.service';


@Component({
  selector: 'app-form-action-button',
  imports: [CommonModule, RippleModule, ButtonModule],
  templateUrl: './form-action-button.component.html',
  styleUrls: ['./form-action-button.component.scss']
})
export class FormActionButtonComponent {
  updateMode = input<boolean, unknown>(false, {transform: booleanAttribute});
  createOrCancelMode = input<boolean, unknown>(false, {transform: booleanAttribute});
  disabledCreateOrUpdateButton = input<boolean, unknown>(false, {transform: booleanAttribute});
  showDeleteButton = input<boolean, unknown>(false, {transform: booleanAttribute});
  creatingOrUpdating = input<boolean, unknown>(false, {transform: booleanAttribute});
  deleting = input<boolean, unknown>(false, {transform: booleanAttribute});
  buttonCreateNamedAs = input<string>('Create');
  buttonCancelNamedAs = input<string>('Cancel');
  deleteMessage = input<string>();
  createOrUpdate = output<Event>();
  cancel = output<Event>();
  delete = output<Event>();

  constructor(
    private confirmationDialogService: ConfirmationDialogService
  ) {}

  onSubmitCreateOrUpdate(event : Event): void {
    event.preventDefault();
    this.createOrUpdate.emit(event);
  }

  onSubmitCancel(event : Event): void {
    event.preventDefault();
    this.cancel.emit(event);
  }

  onSubmitDelete(event : Event): void{
    event.preventDefault();
    this.confirmationDialogService.showDeleteConfirmationDialog(
      () => {
        this.delete.emit(event);
      },
      this.deleteMessage()
    )
  }
}
