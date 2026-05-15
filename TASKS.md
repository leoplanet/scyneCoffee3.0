# scyneCoffee 3.0 — Task Tracker

> Check off as completed. Phases 1-3 are the priority.

---

## Phase 0 — Foundation & Hygiene

- [x] Rename package.json: name → "scyencoffee-3.0", version → "3.0.0"
- [x] Update Router basename: `/scyneCoffee2.0` → `/scyneCoffee3.0`
- [x] Update homepage URL in package.json
- [x] Update `<title>` in index.html
- [x] Create `.env.example` with all `VITE_FIREBASE_*` vars
- [x] Add `.env.local` to `.gitignore`
- [x] Update deploy.yml: checkout@v4, setup-node@v4, peaceiris/actions-gh-pages@v4
- [x] Install `react-error-boundary`, wrap Routes with ErrorBoundary
- [x] Create shared `LoadingSpinner` component
- [ ] Create shared `Skeleton` component (MUI-based)
- [x] Create shared `ToastProvider` (MUI Snackbar stack)
- [x] Set up MUI `ThemeProvider` with base theme
- [x] `npm install` + `npm run build` passes clean

---

## Phase 1 — Frictionless Ordering ★

### Name-First Landing
- [ ] Redesign HomePage: "What's your name?" input + Enter button
- [ ] Store name in session (localStorage + pass to order flow)
- [ ] On name submit, check Firestore `users` collection for matching name
- [ ] If match found, fetch last order and show "Order Again?" banner
- [ ] If no match, proceed to menu with name pre-filled

### Guest Ordering
- [ ] Remove login requirement from menu/order routes
- [ ] Update order creation to accept `customerName` (no userId required)
- [ ] Update Firestore security rules doc to allow guest writes
- [ ] Add optional login prompt: "Create an account to save your orders" after first order

### Last Order & Reorder
- [ ] Create `users` Firestore collection schema
- [ ] On order complete, upsert user doc with `lastOrderId`
- [ ] On name recognition, fetch `lastOrderId` → fetch that order's items
- [ ] "Order Again" button → adds all last-order items to cart in one click
- [ ] Show last order summary card on menu page (collapsible)

### Cart Improvements
- [ ] Persistent cart: save to localStorage on every change
- [ ] Restore cart from localStorage on app load
- [ ] Replace CartModal with CartDrawer (MUI Drawer, right-side slide-out)
- [ ] Cart badge in NavBar showing item count (always visible)
- [ ] Quick-add "+" button on each MenuItemCard (adds default to cart)
- [ ] Inline customization drawer (tap item → slide-out panel for size/milk/extras)
- [ ] Cart quantity stepper (increase/decrease without re-opening item)
- [ ] Clear cart confirmation

### Order Confirmation
- [ ] After order placed, show confirmation screen with large order number
- [ ] Show estimated ready time
- [ ] "Track Order" button → goes to order status view
- [ ] "Order Another" button → clears cart, back to menu

### Real-Time
- [ ] Replace `getDocs` → `onSnapshot` in MenuPage
- [ ] Replace `getDocs` → `onSnapshot` in OrderPage
- [ ] Replace `getDocs` → `onSnapshot` in AdminPage
- [ ] Replace `getDocs` → `onSnapshot` in StatisticPage
- [ ] Replace `getDocs` → `onSnapshot` in News page

---

## Phase 2 — Order Status & Communication

### Order Status
- [ ] Define status enum: `pending` | `preparing` | `ready` | `completed`
- [ ] Add `status` field to order creation (defaults to `pending`)
- [ ] Add `estimatedReadyTime` calculation (based on queue position + avg prep time)
- [ ] Create `OrderStatusBadge` component (color-coded pill)

### Customer Tracking
- [ ] Create `/track` route — enter name or order number → see status
- [ ] Show visual progress: Pending → Preparing → Ready → Completed
- [ ] Show estimated time remaining
- [ ] Real-time updates via `onSnapshot`

### Admin Controls
- [ ] Add status buttons to admin order list (advance one step at a time)
- [ ] Color-code orders by status in admin view
- [ ] Sort active orders by time (oldest first)

### Auth Polish
- [ ] Add `RequireAuth` route guard component
- [ ] Wrap `/admin` routes with `RequireAuth`
- [ ] Add password reset flow to EmailLogin
- [ ] Add "Forgot password?" link to login page

---

## Phase 3 — Admin Analytics Dashboard ★

### KPI Cards
- [ ] "Today's Orders" — count of orders today
- [ ] "Today's Revenue" — sum of totals today
- [ ] "Avg Order Value" — revenue / order count
- [ ] "Active Orders" — count of pending + preparing
- [ ] Show period-over-period change (vs yesterday/last week) with up/down arrows

### Live Order Queue
- [ ] Real-time list of non-completed orders
- [ ] Show: order number, customer name, items summary, time placed, status
- [ ] Inline status buttons (click to advance)
- [ ] Auto-sort by time (oldest first)
- [ ] Sound/visual pulse on new order (optional)

### Revenue Chart
- [ ] Line chart of daily revenue (ECharts)
- [ ] Toggle: Day / Week / Month granularity
- [ ] Comparison line: same period last week/month
- [ ] Hover tooltips with exact values

### Popular Items
- [ ] Top 5 coffees by quantity sold (horizontal bar chart)
- [ ] Week-over-week trend indicator (↑↓)
- [ ] Click item to see detailed breakdown

### Peak Hours
- [ ] Bar chart: orders by hour of day (0-23)
- [ ] Heatmap alternative: day × hour grid
- [ ] Highlight busiest hours

### Filters & Export
- [ ] Date range picker (date-fns + MUI DatePicker)
- [ ] Apply date filter to all dashboard views
- [ ] "Export CSV" button on each chart/table (papaparse)
- [ ] Export includes filtered data only

### Kitchen Display Mode
- [ ] Create `/admin/kitchen` route
- [ ] Fullscreen layout, large text
- [ ] Show active orders only (pending + preparing + ready)
- [ ] Auto-refresh every 5 seconds
- [ ] Color-coded by status and age (green → yellow → red if overdue)
- [ ] Tap/click order to advance status

### Coffee Management
- [ ] Add edit coffee dialog (inline edit in admin)
- [ ] Add delete coffee with confirmation
- [ ] Add `isActive` toggle (hide from menu without deleting)
- [ ] Firebase Storage init + image upload component
- [ ] Image preview in edit dialog

---

## Phase 4 — Polish & Reliability

- [ ] Add `vite-plugin-pwa` + manifest.json
- [ ] Configure service worker (cache shell + API)
- [ ] Add PWA install prompt
- [ ] Dark/light theme toggle in NavBar
- [ ] Persist theme preference in localStorage
- [ ] Route-level code splitting (`React.lazy` + `Suspense`)
- [ ] Empty states for all list views (illustration + text)
- [ ] Error recovery with retry buttons
- [ ] Accessibility: keyboard nav, ARIA labels, contrast check
- [ ] Bug report form improvements (screenshot capture, validation)
- [ ] News/announcements banner on menu page
- [ ] Image lazy loading + WebP support

---

## Phase 5 — Testing & CI

- [ ] Unit test: CartContext (add/remove/clear/persist/restore)
- [ ] Unit test: order creation logic
- [ ] Unit test: name matching / last order lookup
- [ ] Component test: MenuItemCard
- [ ] Component test: CartDrawer
- [ ] Component test: OrderStatusBadge
- [ ] E2E (Playwright): guest order flow (name → menu → order → confirm)
- [ ] E2E (Playwright): reorder flow (returning customer → order again)
- [ ] E2E (Playwright): admin status update flow
- [ ] Storybook: MenuItemCard, CartDrawer, OrderCard, KPI card stories
- [ ] CI: add lint + type-check + test job (separate from deploy)
- [ ] CI: deploy only on green checks
- [ ] Staging deploy on `develop` branch

---

## Phase 6 — Documentation

- [ ] Rewrite README.md (description, features, setup, architecture)
- [ ] Firebase schema documentation (collections, fields, relationships)
- [ ] Firestore security rules documentation
- [ ] CHANGELOG.md
- [ ] CONTRIBUTING.md

---

## Meta

- **Current phase:** Phase 0 (not started)
- **Last updated:** 2026-05-15
- **Sessions worked:** 1
- **Blocked on:** Firebase project setup (user to provide)
