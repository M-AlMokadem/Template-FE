import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { PasswordFieldComponent } from '../password-field/password-field.component';
import { UserFormValue } from '../../models/user-form.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule, PasswordFieldComponent],
  template: `
    <form class="user-form" (ngSubmit)="submit()">
      <div class="form-heading">
        <p class="eyebrow">{{ eyebrow }}</p>
        <h2>{{ title }}</h2>
      </div>
      <mat-form-field appearance="outline" subscriptSizing="dynamic">
        <mat-label>Full name</mat-label>
        <input matInput type="text" name="fullName" required [(ngModel)]="value.fullName">
      </mat-form-field>
      <mat-form-field appearance="outline" subscriptSizing="dynamic">
        <mat-label>Email</mat-label>
        <input matInput type="email" name="email" required email [(ngModel)]="value.email">
      </mat-form-field>
      <app-password-field
        name="password"
        label="Temporary password"
        placeholder="At least 8 characters"
        [required]="true"
        [minlength]="8"
        [(ngModel)]="value.password"
      ></app-password-field>
      <button mat-flat-button color="primary" type="submit" [disabled]="isSubmitting">
        {{ isSubmitting ? 'Saving...' : submitLabel }}
      </button>
    </form>
  `,
  styles: [`
    :host { display: block; }
    .user-form { display: grid; grid-template-columns: minmax(150px, 0.8fr) repeat(3, minmax(160px, 1fr)) auto; gap: 0.75rem; align-items: center; margin: 1.4rem; padding: 1rem; border: 1px solid rgba(22, 33, 62, 0.1); border-radius: 16px; background: rgba(247, 249, 255, 0.9); }
    .form-heading h2 { margin: 0.25rem 0 0; color: #16213e; font-size: 1.05rem; }
    @media (max-width: 900px) { .user-form { grid-template-columns: 1fr 1fr; } .form-heading, .user-form button { grid-column: 1 / -1; } }
    @media (max-width: 560px) { .user-form { grid-template-columns: 1fr; } }
  `]
})
export class UserFormComponent {
  @Input() eyebrow = 'New account';
  @Input() title = 'Create user';
  @Input() submitLabel = 'Create user';
  @Input() isSubmitting = false;
  @Input() value: UserFormValue = { fullName: '', email: '', password: '' };
  @Output() saved = new EventEmitter<UserFormValue>();

  submit(): void {
    if (!this.value.fullName.trim() || !this.value.email.trim() || !this.value.password) {
      return;
    }

    this.saved.emit({ ...this.value });
  }
}
