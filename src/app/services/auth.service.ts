import { Injectable, signal } from '@angular/core';

export interface AuthUser {
	name: string;
	email: string;
}

const STORAGE_KEY = 'versionzero.auth.user';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private readonly currentUserState = signal<AuthUser | null>(this.readStoredUser());

	readonly currentUser = this.currentUserState.asReadonly();

	login(user: AuthUser): void {
		this.currentUserState.set(user);
		this.writeStoredUser(user);
	}

	logout(): void {
		this.currentUserState.set(null);
		this.clearStoredUser();
	}

	private readStoredUser(): AuthUser | null {
		if (typeof localStorage === 'undefined') {
			return null;
		}

		const rawValue = localStorage.getItem(STORAGE_KEY);

		if (!rawValue) {
			return null;
		}

		try {
			return JSON.parse(rawValue) as AuthUser;
		} catch {
			localStorage.removeItem(STORAGE_KEY);
			return null;
		}
	}

	private writeStoredUser(user: AuthUser): void {
		if (typeof localStorage === 'undefined') {
			return;
		}

		localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
	}

	private clearStoredUser(): void {
		if (typeof localStorage === 'undefined') {
			return;
		}

		localStorage.removeItem(STORAGE_KEY);
	}
}