import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AppConfigService } from './app-config.service';

export interface AuthUser {
	id: string;
	fullName: string;
	email: string;
	roles: string[];
}

export interface LoginPayload {
	email: string;
	password: string;
}

export interface RegisterPayload {
	fullName: string;
	email: string;
	password: string;
	confirmPassword: string;
}

interface AuthSession {
	accessToken: string;
	expiresAtUtc: string;
	user: AuthUser;
}

export const AUTH_SESSION_STORAGE_KEY = 'versionzero.auth.session';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private readonly httpClient = inject(HttpClient);
	private readonly appConfigService = inject(AppConfigService);
	private readonly sessionState = signal<AuthSession | null>(this.readStoredSession());

	readonly currentUser = computed(() => this.sessionState()?.user ?? null);
	readonly isAuthenticated = computed(() => this.sessionState() !== null);
	private readonly authApiUrl = `${this.appConfigService.serverUrl}auth`;

	hasRole(role: string): boolean {
		const roles = this.currentUser()?.roles ?? [];
		return roles.includes(role);
	}

	async login(payload: LoginPayload): Promise<void> {
		const response = await firstValueFrom(this.httpClient.post<AuthSession>(`${this.authApiUrl}/login`, payload));
		this.persistSession(response);
	}

	async register(payload: RegisterPayload): Promise<void> {
		const response = await firstValueFrom(this.httpClient.post<AuthSession>(`${this.authApiUrl}/register`, payload));
		this.persistSession(response);
	}

	async logout(): Promise<void> {
		const token = this.sessionState()?.accessToken;

		if (token) {
			try {
				await firstValueFrom(this.httpClient.post(`${this.authApiUrl}/logout`, {}, {
					headers: this.createAuthHeaders(token)
				}));
			} catch {
				// Client logout still proceeds when the API is unavailable.
			}
		}

		this.sessionState.set(null);
		this.clearStoredSession();
	}

	getAccessToken(): string | null {
		return this.sessionState()?.accessToken ?? null;
	}

	private readStoredSession(): AuthSession | null {
		if (typeof localStorage === 'undefined') {
			return null;
		}

		const rawValue = localStorage.getItem(AUTH_SESSION_STORAGE_KEY);

		if (!rawValue) {
			return null;
		}

		try {
			const session = JSON.parse(rawValue) as AuthSession;
			return {
				...session,
				user: {
					...session.user,
					roles: session.user.roles ?? []
				}
			};
		} catch {
			localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
			return null;
		}
	}

	private persistSession(session: AuthSession): void {
		this.sessionState.set(session);
		this.writeStoredSession(session);
	}

	private writeStoredSession(session: AuthSession): void {
		if (typeof localStorage === 'undefined') {
			return;
		}

		localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
	}

	private clearStoredSession(): void {
		if (typeof localStorage === 'undefined') {
			return;
		}

		localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
	}

	private createAuthHeaders(token: string): HttpHeaders {
		return new HttpHeaders({
			Authorization: `Bearer ${token}`
		});
	}

	static toMessage(error: unknown): string {
		if (error instanceof HttpErrorResponse) {
			const backendMessage = error.error?.message;
			if (typeof backendMessage === 'string' && backendMessage.trim().length > 0) {
				return backendMessage;
			}

			const validationErrors = error.error?.errors;
			if (validationErrors && typeof validationErrors === 'object') {
				const firstError = Object.values(validationErrors).flat().find((value) => typeof value === 'string');
				if (typeof firstError === 'string' && firstError.trim().length > 0) {
					return firstError;
				}
			}
		}

		return 'Authentication request failed. Please try again.';
	}
}