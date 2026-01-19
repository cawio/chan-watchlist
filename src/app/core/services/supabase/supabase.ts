import { computed, Injectable, signal } from '@angular/core';
import { environment } from '@env/environment';
import { createClient, SupabaseClient, Session } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class Supabase {
  private supabase: SupabaseClient;
  private sessionLoaded = false;

  readonly session = signal<Session | null>(null);
  readonly user = computed(() => this.session()?.user ?? null);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    this.supabase.auth.getSession().then(({ data }) => {
      this.session.set(data.session);
      this.sessionLoaded = true;
    });

    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.session.set(session);
      this.sessionLoaded = true;
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
    const { error } = await this.supabase.auth.signOut();

    if (error) {
      console.error('Sign out error:', error);
      return;
    }

    window.location.assign('/');
  }

  async getOrLoadSession(): Promise<Session | null> {
    if (this.sessionLoaded) {
      return this.session();
    }

    const { data, error } = await this.supabase.auth.getSession();

    if (error) {
      console.error('Session fetch error:', error);
      return null;
    }

    this.session.set(data.session);
    this.sessionLoaded = true;
    return data.session;
  }

  async invokeFunction<
    TResponse,
    TBody extends
      | string
      | File
      | Blob
      | ArrayBuffer
      | FormData
      | ReadableStream<Uint8Array<ArrayBufferLike>>
      | Record<string, unknown>
      | undefined = Record<string, unknown>,
  >(name: string, body: TBody) {
    const { data, error } = await this.supabase.functions.invoke<TResponse>(name, {
      body,
    });

    if (error) {
      throw error;
    }

    console.log(data);
    return data;
  }
}
