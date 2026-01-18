import { inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { Supabase } from '@services/supabase/supabase';

export interface ReqPayload extends Record<string, unknown> {
  search: string;
}

export interface OmdbSearchItem {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface OmdbSearchResponse {
  Search: OmdbSearchItem[];
  totalResults: string;
  Response: 'True' | 'False';
}

@Injectable({
  providedIn: 'root',
})
export class Omdb {
  private readonly supabase = inject(Supabase);

  async search(payload: ReqPayload): Promise<OmdbSearchResponse | null> {
    const result = await this.supabase.invokeFunction<OmdbSearchResponse>(
      'bright-responder',
      payload,
    );
    console.log(result);
    return result;
  }
}
