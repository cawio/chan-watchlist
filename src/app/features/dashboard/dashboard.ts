import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  Observable,
  catchError,
  debounceTime,
  distinctUntilChanged,
  from,
  finalize,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { Omdb, OmdbSearchItem } from './services/omdb/omdb';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly omdb = inject(Omdb);

  readonly query = new FormControl<OmdbSearchItem | string>('', { nonNullable: true });
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  private readonly options$: Observable<OmdbSearchItem[]> = this.query.valueChanges.pipe(
    startWith(''),
    map((term) => (typeof term === 'string' ? term : (term?.Title ?? ''))),
    debounceTime(200),
    distinctUntilChanged(),
    switchMap((term) => {
      const trimmed = term.trim();
      this.error.set(null);

      if (trimmed.length < 2) {
        this.isLoading.set(false);
        return of<OmdbSearchItem[]>([]);
      }

      this.isLoading.set(true);
      return this.fetchOptions(trimmed).pipe(finalize(() => this.isLoading.set(false)));
    }),
  );

  readonly options = toSignal(this.options$, {
    initialValue: [] as OmdbSearchItem[],
  });
  readonly hasTypedEnough = computed(() => {
    const value = this.query.value;
    const term = typeof value === 'string' ? value : (value?.Title ?? '');
    return term.trim().length >= 2;
  });

  displayOption = (item: OmdbSearchItem | string | null): string => {
    if (!item || typeof item === 'string') {
      return item ?? '';
    }

    const suffix = item.Type ? ` - ${item.Type}` : '';
    return `${item.Title} (${item.Year})${suffix}`;
  };

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const item = event.option.value as OmdbSearchItem | string;
    this.query.setValue(this.displayOption(item), { emitEvent: false });
  }

  private fetchOptions(term: string) {
    return from(this.omdb.search({ search: term })).pipe(
      map((response) => {
        const payload = (response as { data?: unknown } | null)?.data ?? response;

        const search = (payload as { Search?: unknown })?.Search;
        if (Array.isArray(search)) {
          return search as OmdbSearchItem[];
        }

        return [];
      }),
      catchError(() => {
        this.error.set('Something went wrong while searching. Please try again.');
        return of([]);
      }),
    );
  }
}
