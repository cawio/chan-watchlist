import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Supabase } from '../services/supabase/supabase';

export const authGuard: CanActivateFn = async (): Promise<boolean | UrlTree> => {
  const supabase = inject(Supabase);
  const router = inject(Router);

  const session = await supabase.getOrLoadSession();

  if (session?.user) {
    return true;
  }

  return router.createUrlTree(['/']);
};
