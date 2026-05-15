# scyneCoffee 3.0 — Task Tracker

> Check off tasks as completed. Grouped by phase. Use `##` for completed, `##` with strikethrough for blocked/skipped.

---

## Phase 0 — Foundation

- [ ] Rename app to "scyneCoffee 3.0" (package.json name, version 3.0.0)
- [ ] Update Router basename from `/scyneCoffee2.0` to `/scyneCoffee3.0`
- [ ] Update homepage URL in package.json
- [ ] Update HTML title in index.html
- [ ] Create `.env.example` with all VITE_FIREBASE_* vars
- [ ] Add `.gitignore` entry for `.env.local` (if not present)
- [ ] Update deploy.yml: checkout@v3→v4, setup-node@v3→v4, gh-pages-deploy@v4→v5 or v7
- [ ] Add `react-error-boundary` package and wrap Routes
- [ ] Create shared `LoadingSpinner` / `Skeleton` component
- [ ] Add loading states to MenuPage, AdminPage, OrderPage, StatisticPage
- [ ] `npm install` + `npm run build` passes clean

---

## Phase 1 — Core UX

- [ ] Replace `getDocs` → `onSnapshot` in MenuPage (coffee list)
- [ ] Replace `getDocs` → `onSnapshot` in AdminPage (coffee list)
- [ ] Replace `getDocs` → `onSnapshot` in OrderPage
- [ ] Replace `getDocs` → `onSnapshot` in StatisticPage
- [ ] Replace `getDocs` → `onSnapshot` in News page
- [ ] Cart persistence: save/restore cart from localStorage
- [ ] Create `RequireAuth` route guard component
- [ ] Wrap `/admin` with RequireAuth (admin role check if possible)
- [ ] Wrap `/orders` with RequireAuth
- [ ] Add password reset link flow to EmailLogin component
- [ ] Create shared `Snackbar`/toast provider for action feedback
- [ ] Add toast on: order placed, login success, error states, form errors

---

## Phase 2 — Admin & Features

- [ ] Add Firebase Storage init in firebase.ts
- [ ] Build image upload component (drag-drop + preview)
- [ ] Add edit coffee dialog in AdminPage (with image re-upload)
- [ ] Add delete coffee confirmation in AdminPage
- [ ] Add order status enum: pending → preparing → ready → completed
- [ ] Add status field to order creation flow
- [ ] Add admin ability to change order status
- [ ] Add notification when order status changes (in-app)
- [ ] Add date range picker to StatisticPage
- [ ] Filter statistics by date range
- [ ] Add "Export CSV" button to StatisticPage
- [ ] Fix: ensure bug reports are written to Firestore (verify flow)

---

## Phase 3 — Polish

- [ ] Add `vite-plugin-pwa` with manifest.json
- [ ] Configure service worker for offline cache (shell + API)
- [ ] Add PWA install prompt
- [ ] Create MUI theme provider with dark/light modes
- [ ] Add theme toggle button to NavBar
- [ ] Persist theme preference in localStorage
- [ ] Audit all interactive elements for keyboard accessibility
- [ ] Add ARIA labels to icons, buttons, form inputs
- [ ] Check color contrast ratios
- [ ] Add route-level code splitting (`React.lazy` + `Suspense`)
- [ ] Add lazy loading for ECharts components
- [ ] Optimize images (WebP format check, lazy loading)

---

## Phase 4 — Testing & CI

- [ ] Add unit test for CartContext (add/remove/clear)
- [ ] Add unit test for AuthContext (login/logout flow mock)
- [ ] Add unit test for OrderCard component
- [ ] Add unit test for MenuItemCard component
- [ ] Add Playwright E2E: happy path (login → menu → order → confirm)
- [ ] Add Playwright E2E: admin login → add coffee
- [ ] Ensure all Storybook stories load without errors
- [ ] Add CoffeeModal story
- [ ] Add MenuItemCard story
- [ ] Add OrderCard story
- [ ] Add CartModal story
- [ ] Add CI job: lint + type-check + test (separate from deploy)
- [ ] Add staging deploy on `develop` branch (optional)

---

## Phase 5 — Documentation

- [ ] Rewrite README.md: project description, features, setup steps
- [ ] Add Firebase schema documentation
- [ ] Add architecture diagram (optional, text-based)
- [ ] Add CONTRIBUTING.md
- [ ] Add CHANGELOG.md

---

## Meta

- **Current phase:** Phase 0
- **Last updated:** 2026-05-15
- **Sessions worked:** 1
