import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-search-field',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule],
  template: `
    <form class="search-form" (ngSubmit)="submitted.emit()">
      <mat-form-field appearance="outline" subscriptSizing="dynamic">
        <mat-label>{{ label }}</mat-label>
        <input matInput type="search" [placeholder]="placeholder" [name]="name" [ngModel]="value" (ngModelChange)="valueChanged($event)">
        @if (value) {
          <button mat-icon-button matSuffix type="button" aria-label="Clear search" (click)="clear()">
            <mat-icon>close</mat-icon>
          </button>
        }
      </mat-form-field>
      <button mat-flat-button type="submit">Search</button>
    </form>
  `,
  styles: [`
    :host { display: block; }
    .search-form { display: flex; gap: 0.6rem; align-items: flex-start; }
    mat-form-field { width: 260px; }
    @media (max-width: 900px) {
      .search-form { width: 100%; }
      mat-form-field { flex: 1; width: auto; }
    }
  `]
})
export class SearchFieldComponent {
  @Input() label = 'Search';
  @Input() placeholder = '';
  @Input() name = 'search';
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();
  @Output() submitted = new EventEmitter<void>();

  clear(): void {
    this.value = '';
    this.valueChange.emit(this.value);
    this.submitted.emit();
  }

  valueChanged(value: string): void {
    this.value = value;
    this.valueChange.emit(value);
  }
}
