import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { firstValueFrom } from 'rxjs';
import { FilterRequest } from '../../models/filter-request.model';
import { PaginationRequest } from '../../models/pagination-request.model';
import { ToastService } from '../../services/toast.service';
import { UserSummaryDto, UsersApiService } from '../../services/users-api.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  private readonly usersApi = inject(UsersApiService);
  private readonly toastService = inject(ToastService);

  protected readonly users = signal<UserSummaryDto[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly pageNumber = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly totalCount = signal(0);
  protected readonly totalPages = signal(1);
  protected readonly searchTerm = signal('');

  constructor() {
    void this.loadUsers();
  }

  protected async search(): Promise<void> {
    this.pageNumber.set(1);
    await this.loadUsers();
  }

  protected async nextPage(): Promise<void> {
    if (!this.hasNextPage()) {
      return;
    }

    this.pageNumber.update((value) => value + 1);
    await this.loadUsers();
  }

  protected async previousPage(): Promise<void> {
    if (this.pageNumber() <= 1) {
      return;
    }

    this.pageNumber.update((value) => value - 1);
    await this.loadUsers();
  }

  protected async toggleStatus(user: UserSummaryDto): Promise<void> {
    try {
      await firstValueFrom(this.usersApi.updateStatus(user.id, { isActive: !user.isActive }));
      this.toastService.showSuccess(`User ${user.isActive ? 'deactivated' : 'activated'} successfully.`);
      await this.loadUsers();
    } catch {
      // Global interceptor handles toast notification.
    }
  }

  protected hasNextPage(): boolean {
    return this.pageNumber() < this.totalPages();
  }

  protected startItemIndex(): number {
    if (this.totalCount() === 0) {
      return 0;
    }

    return (this.pageNumber() - 1) * this.pageSize() + 1;
  }

  protected endItemIndex(): number {
    return Math.min(this.pageNumber() * this.pageSize(), this.totalCount());
  }

  private async loadUsers(): Promise<void> {
    this.isLoading.set(true);

    const pagination: PaginationRequest = {
      isPaginationRequest: true,
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize()
    };

    const filterRequest: FilterRequest = {
      searchedValue: this.searchTerm().trim(),
      columnsKey: ['fullName', 'email']
    };

    try {
      const response = await firstValueFrom(this.usersApi.getPaged(pagination, filterRequest));
      const pagedData = response.data;

      this.users.set(pagedData.items ?? []);
      this.totalCount.set(pagedData.totalCount ?? 0);
      this.totalPages.set(Math.max(pagedData.totalPages ?? 1, 1));
      this.pageNumber.set(pagedData.pageNumber ?? this.pageNumber());
      this.pageSize.set(pagedData.pageSize ?? this.pageSize());
    } catch {
      this.users.set([]);
      this.totalCount.set(0);
    } finally {
      this.isLoading.set(false);
    }
  }
}
