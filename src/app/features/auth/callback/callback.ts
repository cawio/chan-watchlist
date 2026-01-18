import { Component, effect, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Supabase } from '@services/supabase/supabase';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-callback',
  imports: [MatProgressSpinnerModule],
  templateUrl: './callback.html',
  styleUrl: './callback.scss',
})
export class Callback {
  private router = inject(Router);
  private supabase = inject(Supabase);
  private hasNavigated = false;

  constructor() {
    effect(() => {
      const session = this.supabase.session();
      if (!this.hasNavigated && session && session.user) {
        this.hasNavigated = true;
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
