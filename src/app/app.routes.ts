import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./pages/home/home.component').then((module) => module.HomeComponent)
	},
	{
		path: 'login',
		loadComponent: () => import('./pages/login/login.component').then((module) => module.LoginComponent)
	},
	{
		path: 'register',
		loadComponent: () => import('./pages/register/register.component').then((module) => module.RegisterComponent)
	},
	{
		path: 'users',
		canActivate: [authGuard],
		loadComponent: () => import('./pages/users/users.component').then((module) => module.UsersComponent)
	}
];
