# scyneCoffee 3.0 — Project Plan

> **Forked from:** [FeiCoding000/scyneCoffee2.0](https://github.com/FeiCoding000/scyneCoffee2.0)
> **Your repo:** [leoplanet/scyneCoffee3.0](https://github.com/leoplanet/scyneCoffee3.0)
> **Local path:** `/home/leo/scyneCoffee3.0`
> **Started:** 2026-05-15

---

## 1. What the App Is (v2 Baseline)

A **coffee ordering web app** for a café/school. Users browse the menu, build a cart, and submit an order. Admins manage menu items, view basic statistics (line chart + pie chart), and push notifications.

### Current Architecture (v2)

| Area | Stack |
|------|-------|
| Frontend | React 19 + TypeScript + Vite 7 |
| UI | MUI 7 + Emotion |
| Auth | Firebase Auth (Google + Email/Password) |
| DB | Firebase Firestore (one-shot `getDocs`, no real-time) |
| Charts | ECharts + MUI X-Charts |
| Forms | react-hook-form + Zod 4 |
| Routing | react-router-dom 7 |
| State | React Context (Auth, Cart, Notification) |
| Deploy | GitHub Pages (SPA on `gh-pages` branch) |
| Testing | Vitest + Playwright + Storybook 10 |

### Current Pages

| Route | Page | Purpose |
|-------|------|---------|
| `/` | HomePage | Landing — "Welcome, start your order" button |
| `/login` | LoginPage | Google + Email login |
| `/menu` | MenuPage | Grid of coffees, add to cart |
| `/orders` | OrderPage | View placed orders |
| `/admin` | AdminPage | Add coffee, create/clear notifications |
| `/statistic` | StatisticPage | Line chart (daily data) + pie chart (milk types) |
| `/bugreport` | BugReportPage | Submit bug reports |
| `/news` | News | View notifications/news |

### v2 Problems (Audited)

- **Ordering requires login first** — guest can't order without creating an account
- **No name capture** — orders identified by email only, hard to call out at counter
- **Cart lost on refresh** — no persistence
- **No reorder** — every order starts from scratch
- **No real-time** — all Firestore reads are one-shot, no live updates
- **No order status** — customer has no idea if their order is being prepared
- **Admin stats are basic** — static charts, no date filter, no revenue numbers, no export
- **Admin has no auth guard** — `/admin` is public if you know the URL
- **No image upload** — coffee images are hardcoded URLs
- **Inline styles** scattered across components
- **No error boundaries** — unhandled errors crash the whole app
- **No loading states** — blank screens while data loads

---

## 2. Vision for v3.0

Two radical improvements, everything else supports them:

### Goal 1: Order in 3 Steps (From Any State)

**Today (v2):** Login → Menu → Add to cart → Open cart → Checkout → Enter details → Confirm = **6+ steps, login required first**

**Target (v3):** See menu → Add item → Confirm (name auto-filled from last order) = **3 steps, no login required**

| Feature | How It Reduces Friction |
|---------|------------------------|
| **Guest ordering** | No login wall — order with just a name |
| **Name-first landing** | Home page = "What's your name?" → goes straight to menu with name pre-filled |
| **Last-order memory** | Recognized users (by name or account) see "Order again?" with their last order one-click |
| **Quick-add buttons** | Add default coffee to cart in one tap, customize later if needed |
| **Slide-out cart** | Cart is always accessible from nav, no page navigation |
| **One-tap reorder** | Past orders have an "Order Again" button that pre-fills the cart |
| **Persistent cart** | Survives refresh, survives browser close (localStorage) |

### Goal 2: Real Admin Analytics Dashboard

**Today (v2):** Two static charts loaded once on page visit. No context.

**Target (v3):** A live dashboard that answers "How's business going right now?" at a glance.

| Feature | Why It Matters |
|---------|---------------|
| **KPI cards at top** | Today's orders, today's revenue, avg order value, active orders count |
| **Live order queue** | Real-time feed of incoming orders with status buttons (Pending → Preparing → Ready → Done) |
| **Revenue chart** | Daily/weekly/monthly toggle, with comparison to previous period |
| **Popular items** | Top 5 coffees by quantity sold, with trend arrows (up/down vs last week) |
| **Peak hours heatmap** | Which hours are busiest (helps with staffing) |
| **Date range picker** | Filter everything by custom date range |
| **Export** | CSV download for any view |
| **Kitchen display mode** | Fullscreen view of active orders, large text, auto-refresh (for the barista screen) |

---

## 3. Phases

### Phase 0 — Foundation & Hygiene
> Get the repo ready to build on. No user-visible changes.

- Rename app to "scyneCoffee 3.0" everywhere (package.json, title, basename, homepage URL)
- Create `.env.example` with all `VITE_FIREBASE_*` vars
- Update GitHub Actions to latest versions
- Add React error boundaries
- Add shared loading skeleton/spinner components
- Add shared toast/snackbar provider
- Set up MUI theme provider (foundation for dark/light later)
- `npm install` + `npm run build` passes clean

### Phase 1 — Frictionless Ordering (The Big Win)
> This is the core v3 experience. Everything a customer touches.

- **Guest ordering flow** — remove login requirement for ordering
- **Name-first landing page** — replace "Welcome, start your order" with a name input → goes to menu
- **Name stored in order** — every order has a `customerName` field
- **Last-order detection** — when a name is recognized (localStorage + Firestore check), show "Your last order" card with "Order Again" button
- **One-click reorder** — "Order Again" adds all items from last order to cart
- **Persistent cart** — save/restore cart from localStorage on every change
- **Slide-out cart drawer** — replace modal with a swipe-out drawer, always accessible from nav badge
- **Quick-add on menu items** — "+" button on coffee card adds default option to cart immediately
- **Inline customization** — tap a coffee to open a customization drawer (size, milk, extras) without leaving the menu
- **Order confirmation with order number** — show a clear confirmation screen with a large order number for counter pickup
- **Real-time Firestore** — switch all reads to `onSnapshot` for live updates

### Phase 2 — Order Status & Communication
> Close the loop between ordering and pickup.

- **Order status enum** — `pending` → `preparing` → `ready` → `completed`
- **Status shown to customer** — after ordering, show current status with visual progress
- **Order tracking page** — enter name or order number to see status (no login needed)
- **Admin status controls** — buttons in admin to advance order status
- **In-app notifications** — toast when order status changes (for logged-in users)
- **Password reset flow** — for email auth users
- **Auth route guards** — protect admin/stats routes

### Phase 3 — Admin Analytics Dashboard
> The operational brain of the café.

- **KPI cards** — today's orders, today's revenue, avg order value, active orders
- **Revenue line chart** — with daily/weekly/monthly toggle and period comparison
- **Popular items ranking** — top coffees by volume, with week-over-week trend
- **Peak hours heatmap/bar chart** — orders by hour of day
- **Live order queue** — real-time list of pending/active orders with status buttons
- **Date range picker** — filter all charts by custom range
- **CSV export** — download orders, revenue, or any filtered view
- **Kitchen display mode** — fullscreen `/admin/kitchen` route with large-order display, auto-refresh
- **Full coffee CRUD** — edit and delete existing coffees (admin page)
- **Firebase Storage integration** — upload coffee images via admin

### Phase 4 — Polish & Reliability
> Make it feel like a finished product.

- **PWA** — `vite-plugin-pwa`, manifest, service worker, offline fallback page
- **Dark/light theme toggle** — with localStorage persistence
- **Accessibility audit** — keyboard navigation, ARIA labels, contrast check
- **Code splitting** — `React.lazy` + `Suspense` on heavy routes (admin, stats)
- **Empty states** — illustrations + helpful text for "no orders", "no menu items", etc.
- **Error recovery** — retry buttons on failed fetches, graceful degradation
- **Bug report improvements** — add screenshot capture, better form validation
- **News/announcements** — styled banner at top of menu for promotions

### Phase 5 — Testing & CI
> Confidence for every deploy.

- **Unit tests** — CartContext (add/remove/clear/persist), AuthContext, order creation logic
- **Component tests** — MenuItemCard, OrderCard, CartDrawer, NameInput
- **E2E tests (Playwright)** — guest order flow, login flow, reorder flow, admin status update
- **Storybook** — stories for all shared components
- **CI pipeline** — lint + type-check + test as separate job, deploy only on green
- **Staging deploy** — `develop` branch deploys to a preview URL

### Phase 6 — Documentation
> Make it maintainable.

- **README.md** — description, features, setup steps, architecture
- **Firebase schema doc** — collections, fields, security rules
- **CHANGELOG.md** — track changes between versions
- **CONTRIBUTING.md** — code style, commit conventions

---

## 4. Tech Stack (v3)

| Area | v2 | v3 (changes) |
|------|----|--------------|
| Bundler | Vite 7 | Vite 7 (keep) |
| Framework | React 19 | React 19 (keep) |
| UI | MUI 7 + Emotion | MUI 7 + Emotion (keep, add theme toggle) |
| Auth | Firebase Auth | Firebase Auth + guest mode + password reset |
| DB | Firestore (getDocs) | Firestore (onSnapshot real-time throughout) |
| Storage | None | Firebase Storage (Phase 3, coffee images) |
| PWA | None | vite-plugin-pwa (Phase 4) |
| State | Context only | Context + TanStack Query (for server state + caching) |
| Forms | react-hook-form + Zod 4 | Same |
| Routing | react-router-dom 7 | Same + route guards |
| Testing | Vitest + Playwright + Storybook | Same (add actual tests) |
| Deploy | GitHub Pages | GitHub Pages + staging branch |

### New Dependencies (planned)

| Package | Purpose | Phase |
|---------|---------|-------|
| `@tanstack/react-query` | Server state, caching, real-time polling | 1 |
| `react-error-boundary` | Graceful error recovery | 0 |
| `vite-plugin-pwa` | PWA manifest + service worker | 4 |
| `date-fns` | Date formatting, range picking | 3 |
| `papaparse` | CSV export | 3 |

---

## 5. Firebase Schema (Planned Changes)

```
coffee/
  {id}/
    name, description, price, category, imageUrl, createdAt, updatedAt, isActive

orders/
  {id}/
    customerId          # new: user ID if logged in, null if guest
    customerName        # new: always present, used for counter call-out
    userEmail           # optional, only if logged in
    items[]             # [{coffeeId, name, price, customizations{}}]
    total
    status              # new: pending | preparing | ready | completed
    timestamp
    estimatedReadyTime  # new: calculated from timestamp + queue position

users/                 # new collection
  {id or hashed name}/
    name
    lastOrderId
    orderCount
    joinedAt
```

**Key schema changes from v2:**
- `customerName` on every order (was: email only)
- `status` field on orders (was: no status tracking)
- `users` collection for tracking last orders by name
- `customizations` object on order items (was: flat items)
- `isActive` flag on coffee (for soft-deleting menu items)

---

## 6. User Flows (v3 Target)

### Happy Path: Guest Order (3 steps)
```
1. Land on app → "What's your name?" → type "Leo" → Enter
2. See menu → tap "+" on a coffee → cart badge shows "1"
3. Tap cart badge → review → "Place Order" → "Order #042 — Ready in ~5 min"
```

### Happy Path: Returning Customer (2 steps)
```
1. Land on app → "What's your name?" → type "Leo" → Enter
2. See "Welcome back, Leo! Your last order: Flat White ×2. Order again?" → tap "Order Again" → confirm
```

### Admin: Order Management (live)
```
1. Open /admin → see KPI cards + live order queue
2. New order appears → tap "Preparing" → when done, tap "Ready"
3. Customer sees status update in real-time
```

---

## 7. Risks & Considerations

- **Firebase project** — needs to be set up before Phase 1 (auth + Firestore)
- **Guest orders without auth** — means we rely on `customerName` for identification, which can have collisions (two "Leos"). Mitigation: order numbers for counter call-out
- **Firestore cost** — `onSnapshot` on every page means more read operations. Mitigation: limit collection queries, use composite indexes, monitor usage
- **GitHub Pages SPA routing** — already handled with 404.html trick, keep this
- **Breaking from v2** — if original app is in use, coordinate schema changes. Since this is a fork, we own the breaking changes

---

## 8. Session Notes

- **2026-05-15**: Fork created. Baseline audit done. Plan v1 drafted.
- **2026-05-15**: Plan rewritten with focus on frictionless ordering + admin analytics. Awaiting Firebase setup and green light.
