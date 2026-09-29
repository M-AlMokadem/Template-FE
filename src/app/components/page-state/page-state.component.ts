import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export type PageStateKind = 'loading' | 'empty' | 'error';

@Component({
  selector: 'app-page-state',
  standalone: true,
  imports: [MatButtonModule, MatProgressSpinnerModule],
  template: `
    <div class="state" [class.is-error]="kind === 'error'" role="status">
      @if (kind === 'loading') {
        <mat-spinner diameter="34"></mat-spinner>
      }
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      @if (kind === 'error') {
        <button mat-stroked-button type="button" (click)="retry.emit()">Try again</button>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    .state { display: grid; place-items: center; gap: 0.7rem; padding: 2.4rem 1.4rem 2.6rem; text-align: center; color: #4f5f85; }
    h2, p { margin: 0; }
    h2 { color: #16213e; font-size: 1.15rem; }
    .is-error h2 { color: #9f2c21; }
  `]
})
export class PageStateComponent {
  @Input() kind: PageStateKind = 'empty';
  @Input() title = '';
  @Input() message = '';
  @Output() retry = new EventEmitter<void>();
}
