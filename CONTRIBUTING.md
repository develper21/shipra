# 🤝 Contributing to AppLaunch

Thank you for your interest in contributing to **AppLaunch**! We are committed to keeping this project open-source, framework-agnostic, and accessible to mobile developers worldwide.

---

## 🧭 Code of Conduct
We are dedicated to providing a welcoming, inclusive, and harassment-free experience for everyone. Please be respectful, constructive, and collaborative in all issues, discussions, and pull requests.

---

## 🛠️ Development Setup

### 1. Prerequisites
- **Node.js** v18+ (Node 20+ or 24 recommended)
- **npm** v9+
- **Git**

### 2. Fork and Clone
```bash
git clone https://github.com/<your-username>/expodeploy.git
cd expodeploy
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 5. Verify Build
Before submitting any changes, verify that the project compiles with zero TypeScript or route errors:
```bash
npm run build
```

---

## 🏗️ Repository Architecture

* `src/app/` — Next.js 16 App Router pages:
  * Public Marketing (`/`, `/features`, `/pricing`, `/use-cases`, `/blog`, `/changelog`, `/about`, `/contact`, `/status`)
  * Legal & Trust (`/legal/terms`, `/legal/privacy`, `/legal/aup`, `/legal/dmca`, `/legal/cookies`, `/legal/refund`)
  * Public App Hub (`/a/[slug]`, `/a/[slug]/expired`, `/dev/[username]`)
  * Auth Flow (`/auth/login`, `/auth/signup`, `/auth/verify-email`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/2fa`, `/auth/onboarding`)
  * Developer Dashboard (`/dashboard`, `/dashboard/apps`, `/dashboard/apps/new`, `/dashboard/apps/[id]`, `/dashboard/upload`, `/dashboard/cloud-build`, `/dashboard/team`, `/dashboard/developer`, `/dashboard/billing`, `/dashboard/notifications`, `/dashboard/settings`)
  * Tester Portal (`/tester`, `/tester/invite/[token]`)
  * Admin Console (`/admin`)
* `src/components/common/` — Shared components (Navbar, Footer, CookieBanner, CommandPalette, Modals)
* `src/components/dashboard/` — Dashboard layout, sidebar navigation, and widgets
* `src/context/` — Global state management (`AppContext.tsx`)
* `src/lib/` — Mock datasets and translations (`mockData.ts`, `translations.ts`)
* `src/types/` — Core TypeScript interfaces (`index.ts`)

---

## 📝 Commit Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` Adds a new feature or capability (e.g. `feat(cloud-build): add streaming logs autoscroll`)
- `fix:` Patches a bug or visual regression (e.g. `fix(upload): resolve APK manifest targetSdk parsing`)
- `docs:` Documentation improvements (e.g. `docs: add Expo EAS build profile example`)
- `style:` Formatting or UI polish without logic changes
- `refactor:` Code reorganization that neither fixes a bug nor adds a feature
- `test:` Adding or updating tests

---

## 🚀 Pull Request Checklist

When submitting a pull request, please make sure:

1. [ ] Your branch is rebased on the latest `main` branch.
2. [ ] `npm run build` passes locally without any errors.
3. [ ] Code follows TypeScript strict typing (avoid `any` when possible).
4. [ ] Tailwind CSS utility classes are clean and consistent with our dark/light theme tokens.
5. [ ] You have included a clear description of the problem solved and screenshots/GIFs for UI changes.

Thank you for helping empower indie mobile developers and engineering teams worldwide!
