import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';

const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule],
	templateUrl: './register.component.html',
	styleUrl: './register.component.css'
})
export class RegisterComponent {
	private readonly formBuilder = inject(FormBuilder);
	private readonly authService = inject(AuthService);
	private readonly router = inject(Router);
	protected readonly isSubmitting = signal(false);
	protected readonly errorMessage = signal<string | null>(null);

	protected readonly registerForm = this.formBuilder.nonNullable.group({
		fullName: ['', [Validators.required, Validators.minLength(3)]],
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(strongPasswordPattern)]],
		confirmPassword: ['', [Validators.required]]
	});

	protected async submit(): Promise<void> {
		if (this.registerForm.invalid) {
			this.registerForm.markAllAsTouched();
			return;
		}

		const { password, confirmPassword } = this.registerForm.getRawValue();
		if (password !== confirmPassword) {
			this.errorMessage.set('Password confirmation does not match.');
			return;
		}

		this.isSubmitting.set(true);
		this.errorMessage.set(null);

		try {
			await this.authService.register(this.registerForm.getRawValue());
			await this.router.navigateByUrl('/');
		} catch (error) {
			this.errorMessage.set(AuthService.toMessage(error));
		} finally {
			this.isSubmitting.set(false);
		}
	}
}