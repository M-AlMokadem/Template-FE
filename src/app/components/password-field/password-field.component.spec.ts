/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordFieldComponent } from './password-field.component';

describe('PasswordFieldComponent', () => {
  let fixture: ComponentFixture<PasswordFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordFieldComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordFieldComponent);
    fixture.componentInstance.writeValue('Password123');
    fixture.detectChanges();
  });

  it('hides and reveals the password without changing its value', () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const toggle = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(input.type).toBe('password');
    expect(input.value).toBe('Password123');

    toggle.click();
    fixture.detectChanges();

    expect(input.type).toBe('text');
    expect(input.value).toBe('Password123');
  });
});
