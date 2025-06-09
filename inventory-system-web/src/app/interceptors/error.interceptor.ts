import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const messageService = inject(MessageService);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMsg = '';
      if (error.error instanceof ErrorEvent) {
        console.log('This is client side error');
        errorMsg = `Error: ${error.error.message}`;
      } else {
        console.log('This is server side error');
        console.log(error)
        errorMsg = `Error Code: ${error.status},  Message: ${error.message}`;
        if (error.status === 401) {
          messageService.add({severity: 'error', summary: 'Error', detail: 'Access denied', life: 3000,});
        }
        if (error.status === 403) {
          messageService.add({
            severity: 'error',
            summary: 'Access denied',
            detail: 'It seems you tried to perform an action that is not allowed in this application. If you believe this is a mistake, please contact the administrator.',
            life: 3000,
          });
        }
        if (error.status === 500) {
          messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `${error.error.message}`,
            life: 3000,
          });
        }
        if (error.status === 404) {
          messageService.add({severity: 'error', summary: 'Not found', life: 3000,});
        }
      }
      return throwError(errorMsg);
    })
  );
};
