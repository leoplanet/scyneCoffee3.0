# scyneCoffee 3.0 — Project Plan

> **Forked from:** [FeiCoding000/scyneCoffee2.0](https://github.com/FeiCoding000/scyneCoffee2.0)
> **Your repo:** [leoplanet/scyneCoffee3.0](https://github.com/leoplanet/scyneCoffee3.0)
> **Started:** 2026-05-15

---

## 1. What the App Is (v2 Baseline)

A **coffee ordering web app** for a café/school setting. Users browse the menu, build an order in a cart, and submit. Admins manage menu items, view statistics, and push notifications.

### Current Architecture (v2)

| Area | Stack |
|------|-------|
| Frontend | React 19 + TypeScript + Vite 7 |
| UI Library | MUI (Material UI) 7 + Emotion |
| Auth | Firebase Auth (Google + Email/Password) |
| Database | Firebase Firestore |
| Charts | ECharts + MUI X-Charts |
| Forms | react-hook-form + Zod 4 |
| Routing | react-router-dom 7 |
| State | React Context (Auth, Cart, Notification) |
| Deploy | GitHub Pages (SPA on gh-pages branch) |
| CI/CD | GitHub Actions (deploy.yml) |
| Testing | Vitest + Playwright + Storybook 10 |

### Current Pages

| Route | Page | Purpose |
|-------|------|---------|
| `/` | HomePage | Landing, login/start |
| `/login` | LoginPage | Google + Email login |
| `/menu` | MenuPage | Browse coffees, add to cart |
| `/orders` | OrderPage | View placed orders |
| `/admin` | AdminPage | CRUD coffees, notifications |
| `/statistic` | StatisticPage | Sales charts (line + pie) |
| `/bugreport` | BugReportPage | Submit bug reports |
| `/news` | News | View notifications/news |

### Current Issues (v2 Audit)

- **No real-time updates** — Firestore queries are one-shot `getDocs`, no `onSnapshot`
- **No offline support** — no PWA, no cache
- **Admin has no auth guard** — anyone can hit `/admin` if they know the route
- **Inline styles** scattered across components (HomePage, etc.)
- **No error boundaries** — unhandled errors crash the whole app
- **No loading states** visible in many data-fetching flows
- **Cart persists only in memory** — refresh = lost cart
- **No password reset** flow in email auth
- **No image upload** — coffee images are likely hardcoded URLs
- **Statistics page** has no date filtering or export
- **Deploy** uses older action versions (checkout@v3, setup-node@v3)
- **No env.example file** — onboarding requires guessing env vars

---

## 2. Vision for v3.0

Make the app **production-ready, polished, and extensible** while keeping the same core purpose. Work in phases so progress is visible and testable at each step.

### Guiding Principles

- **Incremental** — each phase ships a working app
- **Backwards compatible** — keep the same Firebase structure where possible
- **Developer-friendly** — clear docs, env example, consistent patterns
- **User-friendly** — real-time, offline-capable, accessible

---

## 3. Phases

### Phase 0 — Foundation (Setup & Hygiene)
- Rename app to "scyneCoffee 3.0" everywhere (package.json, title, basename)
- Add `.env.example` with all required Firebase vars
- Update deploy.yml to latest action versions (checkout@v4, setup-node@v4, deploy@v4+)
- Add ESLint + TypeScript strictness improvements
- Add React error boundaries
- Add loading skeletons / spinners for data fetches

### Phase 1 — Core UX Improvements
- **Real-time Firestore** — replace `getDocs` with `onSnapshot` for menu, orders, stats
- **Persistent cart** — save cart to localStorage (or IndexedDB via idb)
- **Auth guards** — protect `/admin`, `/orders` with route guards
- **Password reset** — add forgot-password flow
- **Toasts/snackbars** — consistent feedback for all actions (order placed, error, etc.)

### Phase 2 — Admin & Features
- **Image upload** — integrate Firebase Storage for coffee images
- **Edit/Delete coffee** — full CRUD in AdminPage (currently only create seems present)
- **Date filtering** on statistics page
- **Export statistics** as CSV/PDF
- **Order status** — add status tracking (pending, preparing, ready, completed)
- **Order notifications** — push notification when order status changes

### Phase 3 — Polish & Performance
- **PWA** — add manifest, service worker (vite-plugin-pwa), offline fallback
- **Dark/light theme toggle** — with MUI theme provider
- **Accessibility audit** — keyboard nav, ARIA labels, contrast
- **Performance** — code splitting, lazy loading routes, image optimization
- **Analytics** — add basic page-view tracking (optional, privacy-respecting)

### Phase 4 — Testing & CI/CD
- **Component tests** — add Vitest tests for key components (Cart, Order, Auth)
- **E2E tests** — Playwright smoke tests for critical paths
- **Storybook** — ensure all components have stories
- **CI checks** — lint, type-check, and test in GitHub Actions before deploy
- **Pre-release staging** — deploy to a separate branch for preview

### Phase 5 — Documentation
- **README.md** — full project docs, setup instructions, architecture overview
- **API/docs** — Firebase schema documentation
- **Contributing guide** — code style, commit conventions

---

## 4. Tech Stack (v3)

| Area | v2 | v3 (changes) |
|------|----|--------------|
| Bundler | Vite 7 | Vite 7 (keep) |
| Framework | React 19 | React 19 (keep) |
| UI | MUI 7 + Emotion | MUI 7 + Emotion (keep, add theme toggle) |
| Auth | Firebase Auth | Firebase Auth + password reset + route guards |
| DB | Firestore (getDocs) | Firestore (onSnapshot real-time) |
| Storage | None | Firebase Storage (images) |
| PWA | None | vite-plugin-pwa |
| State | Context | Context + TanStack Query (for server state) |
| Forms | react-hook-form + Zod 4 | Same |
| Testing | Vitest + Playwright + Storybook | Same (add actual tests) |
| Deploy | GitHub Pages | GitHub Pages + staging branch |

---

## 5. Firebase Schema (Current)

```
coffee/
  {id}/
    name, description, price, category, imageUrl, createdAt, ...

orders/
  {id}/
    userId, userEmail, items[], total, status, timestamp, ...

notifications/
  {id}/
    title, message, timestamp, readBy[], ...

bugreports/
  {id}/
    userId, userEmail, description, timestamp, status, ...

news/
  {id}/
    title, content, timestamp, ...
```

---

## 6. Risks & Considerations

- **Firebase project** — you need your own Firebase project or access to the original. The env vars in deploy.yml are stored as repo secrets.
- **Breaking changes** — if the original app is in active use, coordinate any schema changes.
- **GitHub Pages** — SPA routing requires the 404.html workaround (already in place).

---

## 7. Session Notes

- **2026-05-15**: Fork created, baseline audit done, plan drafted. Next: Phase 0.
