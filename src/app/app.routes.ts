import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./pages/home/home.component').then((module) => module.HomeComponent)
	},
	{
		path: 'login',
		loadComponent: () => import('./pages/login/login.component').then((module) => module.LoginComponent)
	}
];
