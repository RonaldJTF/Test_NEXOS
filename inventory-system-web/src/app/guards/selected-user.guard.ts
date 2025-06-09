import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '@services';

export const selectedUserGuard: CanActivateFn = (route, state) => {
  const storageService = inject(StorageService);
  const router = inject(Router);

  const userId = storageService.getUserId();
  if(userId){
    return true;
  }else{
    router.navigate(["/auth-user"], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
};
