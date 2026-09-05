# E-Commerce Frontend (React + TypeScript + Vite)

This directory contains the frontend application for the e-commerce project. It's a React + TypeScript app built with Vite and designed to work with the paired backend in the `backendServer` folder.

**Contents:** concise developer guide, setup, run commands, environment variables, architecture notes, and troubleshooting tips.

**Project Summary**
- **Purpose:** Customer-facing storefront and admin UI for the e-commerce platform.
- **Tech stack:** React, TypeScript, Vite, Tailwind/CSS (project-dependent), ESLint, Vitest (if present).
- **Backend:** API implemented in [backendServer](../backendServer) using Prisma and TypeScript.

**Repository layout (relevant frontend paths):**
- **src/**: application source files and components.
- **src/main.tsx**: app entry.
- **src/App.tsx**: top-level app component and routes.
- **src/layout/ShopLayout.tsx**: primary layout for storefront pages.
- **src/context/AppContext.tsx**: global app state and providers.
- **src/lib/api/**: API client wrappers.
- **public/**: static assets.
- **package.json**: frontend scripts and dependencies.

**Quick Links**
- Development entry: `src/main.tsx`
- Routes and pages: `src/routes/`
- Components: `src/components/`

**Prerequisites**
- Node.js 16+ or the Node version recommended in the `package.json` engines.
- npm, yarn, or bun as package manager (project uses `package.json` scripts).
- Working backend running at the address configured by `VITE_BACKEND_URL`.

## Environment variables
Create a `.env` in this folder or set the variables in your environment. Important variables:
- `VITE_BACKEND_URL`: URL to the backend API (e.g. `http://localhost:4000`).
- `VITE_ADMIN_WHATSAPP_NUMBER`: Admin contact for WhatsApp integrations (optional).

Note: Backend-only secrets (database URLs, JWT secrets, email credentials) must be kept in `backendServer/.env` and never copied to frontend env files.

## Setup and Development
1. Install dependencies:

```bash
cd frontendServer
npm install
# or: bun install or yarn
```

2. Run development server:

```bash
npm run dev
# or: bun run dev
```

The app will start with Vite's dev server and should pick up `VITE_BACKEND_URL` from your `.env` or environment.

## Build and Production
To create a production build and preview locally:

```bash
npm run build
npm run preview
```

Build outputs are written to `dist/` by default (Vite).

## Testing
If the project includes tests (Vitest or Jest), run them with:

```bash
npm run test
```

Adjust the command to your chosen test runner if different.

## Frontend Responsibilities
- Fetch catalog, product, category, and order data from the backend API.
- Provide shopping cart UX and client-side validation.
- Checkout flows that submit orders to the backend.
- Admin pages for product management and order processing (in `src/routes/*` and `src/admin`).

## Backend Integration
The backend lives in the sibling folder [backendServer](../backendServer). Key backend responsibilities:
- Auth and session management.
- Persisting users, products, orders, and other domain models (Prisma + database).
- Business logic for billing, cart items, categories, comments, and verification.

When developing locally, run the backend server (see `backendServer/README.md` if present) and set `VITE_BACKEND_URL` to the backend address.

## Environment and Secrets (backend reminder)
- Keep database and secret values in `backendServer/.env` only.
- Do not commit `.env` files to VCS. Use `.gitignore` to exclude them.

## Linting and Formatting
- ESLint configuration is in the project root and can be extended for type-aware rules. Use your editor's ESLint integration or run:

```bash
npm run lint
```

If the project uses Prettier or other formatters, run the respective command (e.g., `npm run format`).

## Common Commands
- Install: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Preview production build: `npm run preview`
- Lint: `npm run lint`
- Test: `npm run test`

## Troubleshooting
- If the frontend cannot reach the API, verify `VITE_BACKEND_URL` and that the backend is running.
- If types fail to compile, ensure your TypeScript version matches the workspace `tsconfig` settings.
- For CORS or auth errors, check backend CORS settings and auth token handling.

## Deployment notes
- Build the frontend (`npm run build`) and serve the `dist/` folder with a static host (Netlify, Vercel, AWS S3+CloudFront, or similar).
- Configure environment variables in your hosting platform to point to the production backend.

## Contributing
- Fork the repo, create a feature branch, and open a PR with a descriptive title.
- Run linters and tests before submitting.

## Where to look next
- Frontend entry: [src/main.tsx](src/main.tsx#L1)
- App routes: [src/routes](src/routes)
- API clients: [src/lib/api](src/lib/api)
- Backend server: [backendServer](../backendServer)

## License & Contacts
- Check the project root for a `LICENSE` file to determine licensing.
- For questions, contact the project maintainer or check `backendServer/README.md` for backend-specific maintainers.

---
If you'd like, I can also update the root README, add missing `.env.example` files, or generate a short Contributor Guide. Which should I do next?
