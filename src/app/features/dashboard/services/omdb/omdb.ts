import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { lastValueFrom } from 'rxjs';

interface ReqPayload {
  search: string;
}

interface OmdbSearchItem {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

interface OmdbSearchResponse {
  Search: OmdbSearchItem[];
  totalResults: string;
  Response: 'True' | 'False';
}

@Injectable({
  providedIn: 'root',
})
export class Omdb {
  private readonly http = inject(HttpClient);
  private functionUrl = environment.supabaseUrl + '/functions/v1/bright-responder';

  async search(payload: ReqPayload): Promise<OmdbSearchResponse> {
    const result = await lastValueFrom(
      this.http.post<OmdbSearchResponse>(this.functionUrl, payload),
    );
    return result;
  }
}
