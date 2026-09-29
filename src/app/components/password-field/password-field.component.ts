import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-password-field',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PasswordFieldComponent), multi: true }],
  template: `
    <mat-form-field appearance="outline">
      <mat-label>{{ label }}</mat-label>
      <input
        matInput
        [type]="isVisible ? 'text' : 'password'"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [required]="required"
        [attr.minlength]="minlength || null"
        [value]="value"
        (input)="writeValueFromInput($event)"
        (blur)="touched()"
      >
      <button
        mat-icon-button
        matSuffix
        type="button"
        [disabled]="disabled"
        [attr.aria-label]="isVisible ? 'Hide password' : 'Show password'"
        (click)="isVisible = !isVisible"
      >
        <mat-icon>{{ isVisible ? 'visibility_off' : 'visibility' }}</mat-icon>
      </button>
    </mat-form-field>
  `
})
export class PasswordFieldComponent implements ControlValueAccessor {
  @Input() label = 'Password';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() minlength: number | null = null;

  value = '';
  disabled = false;
  isVisible = false;
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValueFromInput(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
    this.onChange(this.value);
  }

  touched(): void {
    this.onTouched();
  }
}
