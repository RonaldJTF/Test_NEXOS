import {Injectable} from '@angular/core';
import {ConfirmationService} from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {
  constructor(private confirmationService: ConfirmationService) {}

  private showConfirmationDialog(
    message: string,
    header: string,
    acceptLabel: string,
    rejectLabel: string,
    acceptAction: () => void,
    rejectAction: () => void = () => {},
  ): void {
    this.confirmationService.confirm({
      key: 'generalConfirmDialog',
      message: message,
      header: header,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: acceptLabel,
      rejectLabel: rejectLabel,
      accept: () => {
        acceptAction()
      },
      reject: () => {
        rejectAction()
      }
    });
  }

  showDeleteConfirmationDialog(acceptAction: () => void, message: string = 'Are you sure you want to delete the record?'): void {
    this.showConfirmationDialog(
      message,
      'Confirmation',
      'Yes',
      'No',
      acceptAction
    );
  }

  showEventConfirmationDialog(message: string, acceptAction: () => void, rejectAction?: () => void): void {
    this.showConfirmationDialog(
      message,
      'Confirmation',
      'Yes',
      'No',
      acceptAction,
      rejectAction,
    );
  }
}
