import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css'
})
export class LoginComponent {
	private readonly formBuilder = inject(FormBuilder);
	private readonly authService = inject(AuthService);
	private readonly router = inject(Router);

	protected readonly loginForm = this.formBuilder.nonNullable.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(6)]]
	});

	protected submit(): void {
		if (this.loginForm.invalid) {
			this.loginForm.markAllAsTouched();
			return;
		}

		const { email } = this.loginForm.getRawValue();
		const name = email.split('@')[0].split(/[._-]/).filter(Boolean).map((part) => part[0]!.toUpperCase() + part.slice(1)).join(' ');

		this.authService.login({
			name,
			email
		});

		void this.router.navigateByUrl('/');
	}
}