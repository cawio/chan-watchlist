import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './core/layout/header/header';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Supabase } from '@services/supabase/supabase';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, MatSidenavModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly supabase = inject(Supabase);

  protected readonly isAuthenticated = computed(() => this.supabase.user() !== null);
  protected readonly title = signal('chan-watchlist');

  public getMaxContentHeight(): string {
    return this.isAuthenticated() ? 'calc(100vh - 64px)' : '100vh';
  }
}
