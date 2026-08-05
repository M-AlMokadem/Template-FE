import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface AuthUser {
	id: string;
	fullName: string;
	email: string;
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

const STORAGE_KEY = 'versionzero.auth.session';
const API_BASE_URL = 'http://localhost:5186/api/auth';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private readonly httpClient = inject(HttpClient);
	private readonly sessionState = signal<AuthSession | null>(this.readStoredSession());

	readonly currentUser = computed(() => this.sessionState()?.user ?? null);
	readonly isAuthenticated = computed(() => this.sessionState() !== null);

	async login(payload: LoginPayload): Promise<void> {
		const response = await firstValueFrom(this.httpClient.post<AuthSession>(`${API_BASE_URL}/login`, payload));
		this.persistSession(response);
	}

	async register(payload: RegisterPayload): Promise<void> {
		const response = await firstValueFrom(this.httpClient.post<AuthSession>(`${API_BASE_URL}/register`, payload));
		this.persistSession(response);
	}

	async logout(): Promise<void> {
		const token = this.sessionState()?.accessToken;

		if (token) {
			try {
				await firstValueFrom(this.httpClient.post(`${API_BASE_URL}/logout`, {}, {
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

		const rawValue = localStorage.getItem(STORAGE_KEY);

		if (!rawValue) {
			return null;
		}

		try {
			return JSON.parse(rawValue) as AuthSession;
		} catch {
			localStorage.removeItem(STORAGE_KEY);
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

		localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
	}

	private clearStoredSession(): void {
		if (typeof localStorage === 'undefined') {
			return;
		}

		localStorage.removeItem(STORAGE_KEY);
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