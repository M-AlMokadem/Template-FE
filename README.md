# VersionZero Frontend

Angular frontend for VersionZero. It uses standalone components, Angular Material, signals, JWT authentication, route guards, HTTP interceptors, and server-side rendering.

## Frontend Structure

```text
Template-FE/
├── src/app/pages/          Route-level pages
├── src/app/components/     Reusable UI components
├── src/app/services/       API, auth, config, and toast services
├── src/app/models/         Typed request and response models
├── src/app/guards/         Authentication and role guards
├── src/app/*interceptor.ts HTTP authentication and error handling
├── public/                 Static assets
└── package.json
```

## Prerequisites

Install:

- Node.js
- npm
- The VersionZero backend, running locally

Verify:

```bash
node --version
npm --version
```

## Setup From Scratch

From the repository root:

```bash
cd Template-FE
npm install
```

The frontend API URL is configured in:

```text
src/app/services/app-config.service.ts
```

The default backend URL is:

```text
http://localhost:5186/api/
```

Start the backend before using login, registration, or user management features. See [../Template-BE/README.md](../Template-BE/README.md) for backend setup and database migrations.

## Start Locally

Start the Angular development server:

```bash
npm start
```

Open:

```text
http://localhost:4200
```

The development server reloads the application when source files change.

## Backend Connection

The frontend currently expects the backend at:

```text
http://localhost:5186/api/
```

Make sure the backend is started with the HTTP profile:

```bash
cd ../Template-BE
dotnet run --project API/API.csproj --launch-profile http
```

If the backend uses a different host or port, update `serverUrl` in `src/app/services/app-config.service.ts`.

The backend must allow the frontend origin through CORS:

```text
http://localhost:4200
```

## Authentication Flow

The frontend authentication flow is:

1. Register through the Register page.
2. Login through the Login page.
3. Store the returned JWT session in local storage.
4. Add the JWT to API requests with `auth-token.interceptor.ts`.
5. Protect routes with `auth.guard.ts`.
6. Use role metadata for restricted pages such as `/users`.

The backend returns a short-lived access token and a refresh token. The Angular auth service stores both values, sends the refresh token when logging out, and exposes `refresh()` for renewing the session.

Current protected route:

```text
/users - Admin role required
```

The backend seeds the `Admin` and `User` roles, but it does not currently create a default development admin user. A user must have the `Admin` role to open the Users page.

## Available User Features

The Users page supports:

- Listing users
- Searching by name or email
- Pagination
- Creating users
- Showing and hiding passwords
- Activating and deactivating users
- Soft-deleting users through the API

The page uses these backend endpoints:

```text
GET  /api/users
POST /api/users
GET  /api/users/{id}
PUT  /api/users/{id}/status
DELETE /api/users/{id}
```

## Frontend Commands

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm start
```

Build for production:

```bash
npm run build
```

Run unit tests:

```bash
npm test
```

Run tests in a single non-interactive pass when supported by the project configuration:

```bash
ng test --watch=false
```

Run the Angular CLI help:

```bash
npx ng help
```

## Production Build Output

The build output is written to:

```text
dist/template-fe/
```

The project also includes SSR output. The generated server can be started with:

```bash
npm run serve:ssr:template-fe
```

## Troubleshooting

### `ng: command not found`

Use the project-local CLI through npm:

```bash
npm start
```

Or install dependencies again:

```bash
npm install
```

### API requests fail

Check:

1. The backend is running.
2. `serverUrl` points to the backend API.
3. The backend allows `http://localhost:4200` through CORS.
4. The browser is using the same HTTP/HTTPS scheme as the configured API URL.

### Users page redirects to login

The page requires an authenticated user with the `Admin` role. Registering a normal user gives the `User` role only. Assign the `Admin` role in the backend database before testing the page.

### Password visibility icon does not appear

Run:

```bash
npm install
npm run build
```

The feature uses Angular Material's `MatIconModule` and `MatButtonModule`.

## Future Frontend Improvements

- Add environment-specific API configuration files.
- Add reusable CRUD table and form components.
- Add confirmation dialogs for destructive actions.
- Add route-level loading and error pages.
- Add component and service tests for user management.
- Add end-to-end browser tests.
