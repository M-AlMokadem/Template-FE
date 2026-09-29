import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { firstValueFrom } from 'rxjs';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';
import { PageStateComponent } from '../../components/page-state/page-state.component';
import { PaginationControlsComponent } from '../../components/pagination-controls/pagination-controls.component';
import { SearchFieldComponent } from '../../components/search-field/search-field.component';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { FilterRequest } from '../../models/filter-request.model';
import { PaginationRequest } from '../../models/pagination-request.model';
import { UserFormValue } from '../../models/user-form.model';
import { ToastService } from '../../services/toast.service';
import { UserSummaryDto, UsersApiService } from '../../services/users-api.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    PageStateComponent,
    PaginationControlsComponent,
    SearchFieldComponent,
    UserFormComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  private readonly usersApi = inject(UsersApiService);
  private readonly toastService = inject(ToastService);
  private readonly confirmDialog = inject(ConfirmDialogService);

  protected readonly users = signal<UserSummaryDto[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly pageNumber = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly totalCount = signal(0);
  protected readonly totalPages = signal(1);
  protected readonly searchTerm = signal('');
  protected readonly isCreating = signal(false);
  protected readonly newUser = signal<UserFormValue>({ fullName: '', email: '', password: '' });
  protected readonly loadError = signal(false);

  constructor() {
    void this.loadUsers();
  }

  protected async search(): Promise<void> {
    this.pageNumber.set(1);
    await this.loadUsers();
  }

  protected async createUser(request: UserFormValue): Promise<void> {
    this.isCreating.set(true);
    try {
      await firstValueFrom(this.usersApi.create({
        fullName: request.fullName.trim(),
        email: request.email.trim(),
        password: request.password
      }));
      this.toastService.showSuccess('User created successfully.');
      this.newUser.set({ fullName: '', email: '', password: '' });
      this.pageNumber.set(1);
      await this.loadUsers();
    } catch {
      // Global interceptor handles toast notification.
    } finally {
      this.isCreating.set(false);
    }
  }

  protected async removeUser(user: UserSummaryDto): Promise<void> {
    const confirmed = await this.confirmDialog.confirm({
      title: 'Delete user?',
      message: `Delete ${user.fullName}? This action will deactivate the account.`,
      confirmLabel: 'Delete'
    });

    if (!confirmed) {
      return;
    }

    try {
      await firstValueFrom(this.usersApi.remove(user.id));
      this.toastService.showSuccess('User deleted successfully.');
      await this.loadUsers();
    } catch {
      // Global interceptor handles toast notification.
    }
  }

  protected async nextPage(): Promise<void> {
    if (this.pageNumber() >= this.totalPages()) {
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

  private async loadUsers(): Promise<void> {
    this.isLoading.set(true);
    this.loadError.set(false);

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
      this.loadError.set(true);
    } finally {
      this.isLoading.set(false);
    }
  }
}
