import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pagination-controls',
  standalone: true,
  imports: [MatButtonModule],
  template: `
    <div class="pager">
      <p>Showing {{ startItemIndex }} - {{ endItemIndex }} of {{ totalCount }}</p>
      <div class="pager-actions">
        <button mat-button type="button" (click)="previous.emit()" [disabled]="pageNumber <= 1">Previous</button>
        <span>Page {{ pageNumber }} of {{ totalPages }}</span>
        <button mat-button type="button" (click)="next.emit()" [disabled]="pageNumber >= totalPages">Next</button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .pager { display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 1rem 1.4rem 1.3rem; color: #4f5f85; }
    .pager p { margin: 0; }
    .pager-actions { display: inline-flex; align-items: center; gap: 0.35rem; }
    @media (max-width: 900px) { .pager { flex-direction: column; align-items: flex-start; } }
  `]
})
export class PaginationControlsComponent {
  @Input() pageNumber = 1;
  @Input() pageSize = 10;
  @Input() totalCount = 0;
  @Input() totalPages = 1;
  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  get startItemIndex(): number {
    return this.totalCount === 0 ? 0 : (this.pageNumber - 1) * this.pageSize + 1;
  }

  get endItemIndex(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalCount);
  }
}
