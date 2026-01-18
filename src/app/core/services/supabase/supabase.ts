import { computed, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { Callback } from 'src/app/features/auth/callback/callback';

@Injectable({
  providedIn: 'root',
})
export class Supabase {
  private supabase: SupabaseClient;

  readonly session = signal<Session | null>(null);
  readonly user = computed(() => this.session()?.user ?? null);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    this.supabase.auth.getSession().then(({ data }) => {
      this.session.set(data.session);
    });

    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.session.set(session);
    });
  }

  async signInWithDiscord() {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${window.location.origin}/callback`,
      },
    });

    if (error) console.error('Login error:', error);
    return { data, error };
  }

  async signOut() {
    await this.supabase.auth.signOut();
  }
}
