import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ConfirmDialogComponent, ConfirmDialogData } from '../components/confirm-dialog/confirm-dialog.component';

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  private readonly dialog = inject(MatDialog);

  confirm(data: ConfirmDialogData): Promise<boolean> {
    return firstValueFrom(this.dialog.open(ConfirmDialogComponent, {
      width: 'min(420px, calc(100vw - 2rem))',
      data
    }).afterClosed()).then((result) => result === true);
  }
}
