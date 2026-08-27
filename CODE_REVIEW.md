# Code Review — TableRounds Frontend

**Scope:** Full client-side Next.js 16 (TypeScript) codebase
**Date:** 2026-08-18
**Method:** Static analysis (tsc --noEmit, eslint) + manual code review
**Focus:** Correctness + Maintainability

---

## 1. Executive Summary

| Metric | Result |
|---|---|
| `tsc --noEmit` | ✅ Passes (exit code 0) |
| ESLint errors | ❌ **36 errors** |
| ESLint warnings | ⚠️ **138 warnings** |
| Duplicate config files | ❌ `next.config.js` + `next.config.ts` (conflict) |
| Dead / commented-out code | ⚠️ Large blocks in `auth.ts` (66 lines), `store.ts` (73 lines) |
| `as any` suppressions | ❌ 21 instances + 11 `eslint-disable` file-level suppressions |
| `console.*` calls | ⚠️ ~20 active `console.error` statements left in production code |

The codebase is **functionally operational** and the core architecture (Redux Toolkit + RTK Query + Socket.IO + Next App Router) is sound. However, there are real correctness risks — particularly in **authentication state management**, **setState-in-effect patterns**, and **type safety erosion** via widespread `as any` usage.

---

## 2. Tooling & Configuration

### 🔴 CRITICAL: Duplicate Next.js config files
Both `next.config.js` and `next.config.ts` exist with **different content**:
- `next.config.js` (38 lines) — contains the full set of `remotePatterns` for image domains (backend.tablerounds.ai, S3, localhost, 192.168.7.42)
- `next.config.ts` (23 lines) — a reduced version with only `localhost:4004`

Next.js 16 **prefers `next.config.ts`** over `next.config.js`. This means the production image remote patterns (S3, backend.tablerounds.ai) are **silently ignored**. Production image optimization will break.

**Fix:** Delete one file and merge all `remotePatterns` into the remaining config.

### 🟡 ESLint script is non-functional
`package.json` lint script is `"lint": "eslint"` — with no path argument. In ESLint 9 (flat config), running bare `eslint` without arguments may resolve to different behavior than `eslint src/`. Developers may unknowingly skip linting.

**Fix:** `"lint": "eslint src/"`.

### 🟡 `components.json` points to non-existent CSS path
`components.json` line 8 references `"css": "src/app/globals.css"`, but the actual file is at `src/styles/globals.css`. This mismatch doesn't break the build (Tailwind is configured separately), but it misleads any tooling or developer expecting the shadcn/ui convention.

### 🟡 `tailwind.config.js` is nearly empty
Only defines a single `spin-slow` animation. The `tailwind.config.js` file should either:
- Be removed in favor of Tailwind v4's `@import` in CSS (which is already used), **or**
- Contain the full content paths and theme configuration.

Currently Tailwind's JIT scanner relies on `next.config.js`'s `content` auto-detection, which works but is implicit.

### 🟡 `env.example` is incomplete
Lists `BACKEND_URL=/api/proxy` and variable names without values. The actual `.env.local` uses a Cloudflare tunnel URL for `NEXT_PUBLIC_API_ENDPOINT`. The `BACKEND_URL` variable doesn't appear to be imported anywhere in the codebase.

---

## 3. Architecture & Design

### 🟢 Good: Clean RTK Query layer
The `baseApi.ts` (createApi) with `injectEndpoints` across domain-specific files (`authApi`, `chatApi`, `testSessionApi`, `notificationApi`, etc.) is well-structured. Tag-based cache invalidation is consistent and correct.

### 🟢 Good: Custom socket singleton
`src/lib/socket.ts` is well-architected: singleton pattern, room deduplication, exponential backoff for server disconnects, SSR safety, and pending-room queue for reconnection races.

### 🟡 `registerApi.ts` — unused import
```ts
import { Country } from 'country-state-city';
```
This import is present at line 1 but `Country` is never referenced in the file. The signup form component handles country logic separately.

### 🟡 Unused Redux slice
`incompleteRetakeSlice.ts` is registered in the store and its actions are defined, but **no component imports or uses them**. The `saveIncompleteRetakeAnswer` action is commented out in `QuizQuestionView.tsx` (line 17). The slice was likely intended for the incomplete-test retake flow but was abandoned mid-implementation.

**Recommendation:** Remove the slice and its store registration, or complete the integration.

### 🟡 Dead code in `src/lib/auth.ts` (100%)
The entire file (66 lines) is commented-out legacy localStorage auth logic. Nothing imports this file. It should be deleted.

### 🟡 Dead code in `store.ts`
73 lines of the 134-line file are commented-out Redux configuration from a previous iteration. The active code (lines 74–134) is clean and correct. The commented section causes git blame noise and confusion.

### 🔄 Circular imports (latent)
- `ChatContext.tsx` imports from `chatApi` and `chatSlice`
- `useChatSocket.ts` imports from `chatApi`, `notificationApi`, `NotificationSlice`, and directly imports the `store`

While this works because of RTK's design (slices register before runtime), the direct `import { store }` in `useChatSocket.ts` and `NotificationSheet.tsx` creates a **circular dependency path** through the store module. If the import graph is reorganized in the future, this could cause runtime initialization order issues.

---

## 4. Correctness Issues (Priority)

### 🔴 CRITICAL: Authentication state initialization race
**File:** `src/app/AuthProvider.tsx`

```ts
const token = useAppSelector(state => state.auth.auth?.token);
const isAppLoading = token === false;  // ← uses 'false' as sentinel
```

The `authSlice` initial state is `{ token: false }`. The `AuthProvider` uses `token === false` to detect "auth not yet initialized". However, when `setAuth` fires with `token: null` (no saved cookie), `token` becomes `null`, `isAppLoading` becomes `false`, and **children render immediately** — before `useMeQuery` has had a chance to fetch user data.

This means:
1. Unauthenticated users briefly see dashboard content before `useMeQuery` returns 401 and potentially redirects.
2. The `AuthProvider` is **nested inside** `DashboardLayout` (see below), so it only wraps dashboard routes, not the public client layout where `useMeQuery` is also called in `Navbar.tsx`.

### 🔴 CRITICAL: AuthProvider is nested in DashboardLayout, not RootLayout
**File:** `src/app/(Dashboard)/dashboard/layout.tsx`

```tsx
export default function DashboardLayout({ children }) {
  return (
    <AuthProvider>        /* ← Auth initialized HERE */
      <ChatProvider>
        {children}
      </ChatProvider>
    </AuthProvider>
  );
}
```

But the **RootLayout** (`src/app/layout.tsx`) also wraps everything in `<AuthProvider>`. This means:
- Public routes (`/` via ClientLayout) get `AuthProvider` from RootLayout — OK.
- Dashboard routes get **two nested** `AuthProvider` instances — the inner one from `dashboard/layout.tsx` and the outer from root. Both call `useInitiateAuthState()`, which dispatches `setAuth` from cookies and triggers `useMeQuery` potentially **twice**. This is wasteful and can cause state thrashing.

**Fix:** Remove `<AuthProvider>` from `DashboardLayout`. The root layout already provides it.

### 🔴 HIGH: Login dispatches setAuth redundantly
**File:** `src/app/(client)/(auth)/login/page.tsx`

```ts
const result = await login(data).unwrap();
// authApi's onQueryStarted already dispatched setAuth({ token, role })
dispatch(setAuth({ token: result.authorization.access_token, role: result.type }));
```

The `login` mutation's `onQueryStarted` callback in `authApi.ts` **already** dispatches `setAuth`. The login page dispatches it again redundantly. While not harmful (idempotent), it's dead/confusing code. The `onQueryStarted` approach is also risky — if the mutation is retried, `setAuth` fires multiple times.

### 🔴 HIGH: Middleware enforces role from client cookie (security concern)
**File:** `src/app/middleware.ts`

```ts
const role = req.cookies.get('role')?.value;
if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
  return NextResponse.redirect('/dashboard/user');
}
```

The `role` is stored in a **client-side cookie** that JavaScript can read/write. A user can manually change `Cookies.set('role', 'admin')` in the browser and access admin routes. The middleware only reads cookies — it does **not** verify the token server-side.

**Fix:** The middleware should validate the token against the server, or at minimum, the role should be derived from the token's payload on the server side.

### 🔴 HIGH: Logout doesn't clear token from all layers
**File:** `src/components/shared/Navbar.tsx` (line 62) and `Sidebar.tsx` (line 65)

```ts
// Navbar
await logout().unwrap();
dispatch(clearUser());
window.location.href = '/login';

// Sidebar — only clears Redux, doesn't call logout API
dispatch(clearUser());
router.replace('/login');
```

The Navbar calls the logout API and clears cookies via `clearUser()`. But the Sidebar's "Logout" only dispatches `clearUser()` — **it never calls the `/auth/logout` API**, so the server-side session/token may remain valid. Two different logout implementations exist with inconsistent behavior.

### 🟡 MEDIUM: `Credentials` type uses `false` as token value
**File:** `src/app/redux/authSlice.ts`

```ts
export interface Credential {
  token: string | null | false;
}
initialState: { token: false }
```

Using `false` as a sentinel for "not yet initialized" is a code smell. It forces every consumer to guard with truthiness checks (`if (token)`) rather than proper null/undefined checks. The `AuthProvider`'s `isAppLoading = token === false` couples the loading state to a specific falsy sentinel value.

**Fix:** Use a separate `status: 'uninitialized' | 'loading' | 'authenticated' | 'unauthenticated'` field, or simply use `null` for "no token" and let `isLoading` from `useMeQuery` track loading.

---

## 5. Lint Errors & Type Safety (36 ESLint errors)

### 21 × `@typescript-eslint/no-explicit-any`
Scattered across 14 files. The most problematic:

| File | Line | Code |
|---|---|---|
| `UserStatusApi.ts` | 1 | `import { Conversation } from './chat/chatApi'` — unused import |
| `registerApi.ts` | 1 | `import { Country } from 'country-state-city'` — unused import |
| `ChatContext.tsx` | 129 | `catch (error: any)` |
| `ContactForm.tsx` | 155 | `catch (error: any)` |
| `QuestionCard.tsx` | 295, file-level | file-level `eslint-disable` |
| `QuizQuestionView.tsx` | 215, file-level | file-level `eslint-disable` |
| `view-conversation/[id]/page.tsx` | 34 | `as any` |
| `NotificationSheet.tsx` (both copies) | 262, 295 | `as any` |
| `TestResult.tsx` | 79 | `(result as any)` |
| `ProfileHeader.tsx` | 59 | `as any` |
| `NotificationSlice.ts` | 83 | `(item.notification_event?.type as any)` |
| `create-test/[testId]/page.tsx` | 130 | `(data as any)?.user_answers` |
| `my-profile/page.tsx` | 20 | `mapProfileToUI(data as any)` |
| `test-review/[testId]/page.tsx` | 570, 853, 896, 947 | file-level `eslint-disable` + `as any` |
| `CreateQuestionForm.tsx` | 212 | `as any` |
| `AnswerFeedback.tsx` | 24 | `as any` |
| `AnswerToast.tsx` | 19 | `(window as any).webkitAudioContext` |
| `QuestionSidebar.tsx` | 46 | `as any` |
| `playWelcomeAudio.tsx` | 4 | `(window as any).webkitAudioContext` |
| `TestCompleteCelebration.tsx` | 126 | `(window as any).webkitAudioContext` |
| `PublicationCard.tsx` | 137 | `(existing as any)?.id` |

### 14 × `react-hooks/set-state-in-effect`
All are setState calls directly in `useEffect` bodies. This is flagged by React's modern linting rules. Files affected:

- `create-test/[testId]/page.tsx` (lines 228, 252)
- `test-review/[testId]/page.tsx` (lines 700, 725)
- `FollowersFollowingModal.tsx` (lines 22, 30, 50, 72 in user-profile copy)
- `MessageSection.tsx` (lines 255, 269)
- `TestResult.tsx` (line 24)
- `PricingManagerPage.tsx` (line 30)
- `PaymentMainPage.tsx` (line 22)

### 1 × `react/no-unescaped-entities`
**File:** `src/app/(client)/(auth)/login/page.tsx`, line 84
A raw apostrophe in "Don't" needs to be escaped as `'` or wrapped in JSX expression.

### 138 Warnings include:
- **20+ unused imports/variables** (`SmoothScroll`, `Conversation`, `Country`, `ManageProfile`, `router`, `error`, etc.)
- **7+ `react-hooks/exhaustive-deps`** warnings (missing dependencies in useEffect/useMemo/useCallback)
- **8+ `@next/next/no-img-element`** — raw `<img>` tags instead of `next/image` (LCP/perf issue)
- **2 `Compilation Skipped: Use of incompatible library`** warnings — likely from a dependency's TypeScript definitions
- **8× `react-hooks/exhaustive-deps`** — missing dependencies

---

## 6. Code Quality Observations

### 🟡 Inconsistent file naming
- `StatisTicsApi.ts` (capital T) vs `userStatusApi.ts`, `testSessionApi.ts` — inconsistent casing
- `signup` directory is named `conatct` (typo) at `src/components/conatct/`
- `StatsCards .tsx` has a trailing space in the filename

### 🟡 Inconsistent component prop patterns
- `Sidebar.tsx` conditionally renders two `<ResetBankModal>` components (one in desktop branch, one in mobile) with **empty `onConfirm` callbacks** (`onConfirm={() => {}}`). The reset-bank modal confirmation does nothing.
- `Btn.tsx` accepts both `text` and `children` props with unclear precedence — `children` wins if present, but this isn't documented.

### 🟡 Commented-out code in production files
- `Topbar.tsx` (lines 24-28) has commented `console.log` with decorative separators
- `Footer.tsx` (lines 80-135) has a large commented-out email provider dropdown
- `test-review/[testId]/page.tsx` has triple-nested commented blocks (`// // //`)
- `QuestionCard.tsx` (line 814) has a commented `catch` block

### 🟡 Hardcoded development URL in `startTestApi.ts`
```ts
// Not found here, but...
```
Actually, hardcoded URLs were found in:
- `mapTestDataToQuestions` in `create-test/[testId]/page.tsx` line 121: `'https://backend.tablerounds.ai/public/storage/question/'` — **hardcoded production URL** embedded in transformation logic, bypassing the `NEXT_PUBLIC_API_ENDPOINT` env variable.

### 🟡 `.env.local` committed or not?
`.gitignore` has `.env*` which excludes `.env.local`. Good. But the file is visible in the editor tabs, suggesting it exists locally. It contains a Cloudflare tunnel URL which looks like a temporary dev tunnel — this should not be committed.

---

## 7. Recommendations (Prioritized)

### 🔴 Immediate (Correctness / Security)
1. **Merge `next.config.js` and `next.config.ts`** into a single file — this will break image loading in production.
2. **Remove duplicate `<AuthProvider>` from `dashboard/layout.tsx`** — it's already in root layout.
3. **Fix the auth initialization flow** — replace `token === false` sentinel with explicit loading state. Use `useMeQuery`'s `isLoading` to gate rendering.
4. **Validate role server-side in middleware** — don't trust client-writable cookies for authz.
5. **Unify logout behavior** — Sidebar logout should call the logout API, not just clear client state.
6. **Fix the login page unescaped entity** (line 84 — "Don't").

### 🟠 Short-term (Code Health)
7. **Remove all `eslint-disable` suppressions** for `@typescript-eslint/no-explicit-any` and fix the underlying type issues. Define proper interfaces for API responses instead of casting to `any`.
8. **Extract common catch-error typing** into a typed helper:
   ```ts
   import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
   ```
9. **Fix all 14 `set-state-in-effect` errors** — move setState to event handlers, or use `useReducer` for derived state, or restructure logic to avoid state duplication.
10. **Remove dead code:** `src/lib/auth.ts` (entire file), 73 lines of commented store config, unused imports throughout.
11. **Remove or complete `incompleteRetakeSlice`** — it's configured but never used.
12. **Replace `<img>` tags with `next/image`** in components that use raw img (8+ instances).

### 🟢 Medium-term (Maintainability)
13. **Standardize API response typing** — create a shared `ApiResponse<T>` type and use it consistently across all API slices instead of each one redefining it.
14. **Remove hardcoded URL** in `mapTestDataToQuestions` — use `NEXT_PUBLIC_API_ENDPOINT`.
15. **Fix `components.json`** CSS path from `src/app/globals.css` to `src/styles/globals.css`.
16. **Rename typo'd directories** (`conatct` → `contact`, `StatsCards .tsx` → `StatsCards.tsx`).
17. **Add ESLint to CI** — the `lint` script currently doesn't specify `src/`, and `--max-warnings 0` isn't in the script, so errors silently pass.

---

## 8. Positive Highlights

Despite the issues above, several parts of the codebase are well-executed:

- ✅ **Socket.io layer** (`socket.ts`) — production-grade with reconnection, room management, and SSR safety
- ✅ **RTK Query cache invalidation strategy** — consistent tag usage, `providesTags`/`invalidatesTags` patterns
- ✅ **Optimistic updates in chat** — `ChatContext.tsx` implements proper optimistic UI with rollback on failure
- ✅ **TypeScript strict mode** enabled, compiles cleanly
- ✅ **SSR-safe Redux storage** — custom `reduxStorage.ts` avoids localStorage warnings
- ✅ **Responsive design** — consistent use of Tailwind responsive prefixes
- ✅ **Comprehensive README** with tech stack documentation

---

## Summary Table

| Category | Count | Severity |
|---|---|---|
| TypeScript errors | 0 | — |
| ESLint errors | 36 | 🔴 High |
| ESLint warnings | 138 | ⚠️ Medium |
| `as any` suppressions | 21 | 🔴 Type safety erosion |
| Hardcoded production URLs | 1 | 🔴 |
| Duplicate config files | 1 (`next.config`) | 🔴 |
| Dead code blocks | ~200 lines | 🟡 |
| Security: role in client cookie | 1 | 🔴 |
| Redundant AuthProvider nesting | 1 | 🟡 |
| Inconsistent logout behavior | 2 implementations | 🟡 |
