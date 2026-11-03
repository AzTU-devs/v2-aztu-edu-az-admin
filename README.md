# AzTU admin panel

Content management dashboard for the Azerbaijan Technical University website, https://admin.aztu.edu.az. Built on the TailAdmin React template (MIT, see `LICENSE.md`).

## Stack

- React 19, TypeScript, Vite 6
- React Router 7, Redux Toolkit
- Tailwind CSS

## Getting started

```bash
npm ci
echo "VITE_API_BASE_URL=http://localhost:8000" > .env.local
npm run dev
```

The production API accepts admin sign-ins only from `https://admin.aztu.edu.az`, so develop against a local API.

## Scripts

| Command | |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Type check and production build into `dist/` |
| `npm run lint` | ESLint |
| `npm run test:security` | Browser security checks |

## Structure

| Path | Contents |
|---|---|
| `src/pages/` | Screens, one folder per content area |
| `src/services/` | API calls |
| `src/config/routePermissions.ts` | Permission required by each screen |
| `src/components/`, `src/layout/` | Shared UI |
| `deploy/` | nginx snippets for the admin site |

## Sign-in

Administrators sign in with username, password and a TOTP code. The first sign-in shows the authenticator setup key and eight one-time recovery codes.

## Deployment

`VITE_API_BASE_URL` is compiled into the build.

```bash
npm ci
VITE_API_BASE_URL=https://api.aztu.edu.az npm run build
```

Copy `dist/` into the web root that nginx serves for admin.aztu.edu.az. Details are in the project handover document.
