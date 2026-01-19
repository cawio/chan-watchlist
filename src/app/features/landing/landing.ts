import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';

import { Supabase } from '../../core/services/supabase/supabase';

@Component({
  selector: 'app-landing',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './landing.html',
  styleUrls: ['./landing.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'landing-shell',
  },
})
export class Landing {
  private readonly supabase = inject(Supabase);
  private readonly iconRegistry = inject(MatIconRegistry);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly loggingIn = signal(false);
  protected readonly error = signal<string | null>(null);

  constructor() {
    this.iconRegistry.addSvgIcon(
      'discord',
      this.sanitizer.bypassSecurityTrustResourceUrl('/discord.svg'),
    );
  }

  async onLogin() {
    if (this.loggingIn()) {
      return;
    }

    this.loggingIn.set(true);
    this.error.set(null);

    const { error } = await this.supabase.signInWithDiscord();

    if (error) {
      console.error('Discord login failed', error);
      this.error.set('Could not start Discord login. Please try again.');
      this.loggingIn.set(false);
    }
  }
}
