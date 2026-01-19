import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { Supabase } from '@services/supabase/supabase';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatMenuModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  private readonly supabase = inject(Supabase);

  readonly user = this.supabase.user;

  constructor() {
    console.log(this.user());
  }

  signOut() {
    this.supabase.signOut();
  }
}
