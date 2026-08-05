import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-nav-user',
	standalone: true,
	imports: [RouterLink, MatButtonModule],
	templateUrl: './nav-user.component.html',
	styleUrl: './nav-user.component.css'
})
export class NavUserComponent {
	private readonly authService = inject(AuthService);

	protected readonly currentUser = this.authService.currentUser;
	protected readonly initials = computed(() => {
		const user = this.currentUser();

		if (!user) {
			return '';
		}

		return user.fullName
			.split(' ')
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase() ?? '')
			.join('');
	});

	protected logout(): void {
		void this.authService.logout();
	}
}