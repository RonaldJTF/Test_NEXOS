import { inject } from '@angular/core';
import {
  HttpResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { tap } from 'rxjs';
import { MessageService } from 'primeng/api';

export const okInterceptor: HttpInterceptorFn = (request, next) => {
  const messageService = inject(MessageService);

  return next(request).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
          if (request.method === 'POST' && event.status === 201) {
            messageService.add({
              severity: 'success',
              summary: 'Record Created',
              detail: 'The record has been successfully created.',
            });
          } else if (request.method === 'PUT' && event.status === 201) {
            messageService.add({
              severity: 'success',
              summary: 'Record Updated',
              detail: 'The record has been successfully updated.',
            });
          } else if (request.method === 'DELETE' && event.status === 204) {
            messageService.add({
              severity: 'success',
              summary: 'Record Deleted',
              detail: 'The record has been successfully deleted.',
            });
          } else if (request.method === 'DELETE' && event.status === 206) {
            messageService.add({
              severity: 'info',
              summary: 'Partial Deletion',
              detail: 'Some records could not be deleted.',
            });
          }
        }
    })
  );
};
