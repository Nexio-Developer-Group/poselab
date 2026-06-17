# PoseLab — Pre-Launch Development Goals

> Version: 1.2.0 | Target: Production Launch
> Scope: All goals must be complete before going live.

---

## Goal 1 — Complete Backend API Integration

**Current State:** Only 5 auth endpoints exist (`/api/auth`, `/api/signup`, `/api/sign-out`, `/api/forgot-password`, `/api/reset-password`). All community feed, gallery, creations, and pose data are mocked on the frontend.

**What to Build:**
- `POST /api/renders` — save a completed render (image + metadata)
- `GET /api/renders/:userId` — fetch a user's render history
- `GET /api/poses` — list community shared poses with pagination
- `POST /api/poses` — save and publish a pose preset
- `POST /api/posts` — submit a post to the community feed
- `GET /api/feed` — paginated home feed with like/bookmark counts
- `POST /api/feed/:postId/like` — toggle like on a post
- `POST /api/feed/:postId/bookmark` — toggle bookmark on a post
- `GET /api/profile/:userId` — public profile with stats
- `PATCH /api/profile` — update avatar, username, bio

**Acceptance Criteria:**
- Every page that currently uses mock data is wired to a real API endpoint.
- API responses match Zod schemas defined in the frontend.
- Error states (404, 401, 500) are handled and shown in the UI.

---

## Goal 2 — Secure Secrets & Environment Configuration

**Current State:** Firebase API keys are hardcoded in `/src/firebase.ts`. No `.env` file strategy is in place. The backend URL is hardcoded as a plain string in `app.config.ts`.

**What to Build:**
- Move all secrets into `.env` files using Vite's `import.meta.env` pattern.
  ```
  VITE_FIREBASE_API_KEY=
  VITE_FIREBASE_AUTH_DOMAIN=
  VITE_FIREBASE_PROJECT_ID=
  VITE_API_BASE_URL=
  ```
- Add `.env.example` with all required keys (no values) committed to the repo.
- Add `.env` and `.env.local` to `.gitignore`.
- Replace all hardcoded keys/URLs in source files with `import.meta.env.*` references.
- Configure CI/CD secrets in the deployment environment.

**Acceptance Criteria:**
- Zero secrets committed in source code.
- App builds correctly using env vars injected at build time.
- New developer can run the project after copying `.env.example` and filling values.

---

## Goal 3 — Consolidate the Character Rig System

**Current State:** Three separate, parallel rig implementations exist:
1. `standard/MinecraftCharacter.tsx` — rigid body with basic joints
2. `bendable/BendableMinecraftCharacter.tsx` — flexible skeleton with `SkeletonSystem`, `ArmSystem`, `LegSystem`
3. `rigid-system/NewMinecraftCharacter.tsx` — a third approach with `minecraftRig.ts`

This triples the maintenance surface, causes inconsistent behavior across pose modes, and confuses the pose-preset format.

**What to Build:**
- Audit all three rigs: document what each supports (joint count, facial controls, attachment points).
- Pick one as the canonical rig or merge the best features into a single `MinecraftRig` abstraction.
- Migrate all pose presets into a single shared `posePresets.ts` format compatible with the chosen rig.
- Delete the two deprecated rig directories after migration.
- Update `CharacterViewer.tsx` to use only the canonical rig.

**Acceptance Criteria:**
- One rig system used across the entire app.
- All existing preset poses (standing, running, walking, combat, sitting, waving) work correctly.
- Facial expression controls and attachment points remain functional.

---

## Goal 4 — Implement Real Render Persistence & Gallery

**Current State:** The render export pipeline in `renderUtils.ts` correctly generates PNG output and downloads it locally. However, renders are never saved to a backend or linked to the user's account. `myCreations/` shows a mock gallery.

**What to Build:**
- After a successful render, upload the PNG to cloud storage (Firebase Storage or equivalent).
- Save render metadata (image URL, pose snapshot, skin URL, timestamp, render settings) via `POST /api/renders`.
- Wire `myCreations/` to `GET /api/renders/:userId` with real data.
- Support filtering by date and render type in the gallery.
- Add delete-render capability (`DELETE /api/renders/:renderId`).
- Show a per-render detail view with the pose settings used.

**Acceptance Criteria:**
- A render survives a page refresh and is visible in My Creations.
- A user logging in on a second device sees their full render history.
- Deleting a render removes it from both the UI and storage.

---

## Goal 5 — Complete Creator Space

**Current State:** The `/creatorSpace` route shows a `<ComingSoon />` placeholder.

**What to Build:**
- **Creator Dashboard:** stats on their published poses (views, saves, likes) and renders.
- **Pose Publishing:** a flow to take a current in-editor pose, add a name/description/tags, and publish it to the community pose library.
- **Creator Profile Badge:** display "Creator" badge on profile once a pose is published.
- **Creator Application Review:** wire the existing creator application form (`/account/creatorApplication`) to a backend endpoint so submissions are stored and reviewable.
- **Pose Management:** list of their published poses with edit/unpublish controls.

**Acceptance Criteria:**
- A user can publish a pose preset from the editor and see it appear in the Creator Space.
- Stats update when other users save or like their poses.
- Creator application submissions are persisted to the backend.

---

## Goal 6 — Add a Test Suite

**Current State:** Zero test files exist. No Jest, Vitest, or Testing Library setup.

**What to Build:**
- Install and configure **Vitest** + **React Testing Library** (aligns with Vite).
- Unit tests (target: all utility functions):
  - `renderUtils.ts` — resolution calculation, quality preset application
  - `pbrMaterials.ts` — material creation
  - `posePresets.ts` — preset shape validation
  - Auth store (`authStore.ts`) — sign-in, sign-out, token refresh logic
- Component tests:
  - `PoseControls` — slider updates propagate to pose state
  - `RenderDialog` — size/quality selection updates settings correctly
  - Auth forms — validation errors appear on invalid input
- Integration tests:
  - Sign-in flow (mocked API): error state, success redirect
  - Render export: mock canvas, verify download is triggered

**Acceptance Criteria:**
- `npm test` runs the suite without errors.
- Core utility functions have ≥80% line coverage.
- CI pipeline runs tests on every push and fails the build on test failure.

---

## Goal 7 — Performance Optimization for 3D Viewport

**Current State:** The `CharacterViewer` loads all three rig systems eagerly, applies post-processing effects (Bloom, SSAO, Depth of Field) unconditionally, and `useDeviceQuality` adjusts quality after mount—causing a visible quality drop on load.

**What to Build:**
- **Lazy-load rig components:** use `React.lazy` + `Suspense` for `BendableMinecraftCharacter` and `NewMinecraftCharacter`; only load the active rig.
- **Pre-mount quality detection:** run device quality detection before the scene mounts so the correct settings are applied from frame one.
- **Post-processing gating:** disable SSAO and Depth of Field on low/medium quality profiles; only enable on high/ultra.
- **Texture atlas caching:** cache the Minecraft skin canvas texture so re-uploads on the same skin are instant.
- **Shadow map optimization:** use `CascadedShadowMap` for better quality at lower cost on supported devices.
- Measure: target ≥60 fps on mid-range hardware (integrated GPU).

**Acceptance Criteria:**
- No quality-drop flash on initial load.
- Low/medium quality profiles maintain ≥60 fps on integrated GPU (tested in Chrome DevTools CPU throttle 4×).
- Switching between rig types does not cause a full scene remount.

---

## Goal 8 — Mobile Experience & Touch Controls

**Current State:** The UI is responsive at a CSS level, but the 3D pose editor is unusable on mobile: orbit controls require mouse drag, pose sliders stack in a way that pushes the viewport off screen, and the render dialog is not scrollable on small screens.

**What to Build:**
- **Touch orbit controls:** enable `OrbitControls` touch events (pinch-to-zoom, one-finger rotate, two-finger pan) in `CharacterViewer`.
- **Collapsible control panels:** on screens <768px, all sidebar panels (Pose, Lighting, Quality) default to collapsed; expand on tap.
- **Bottom sheet pose controls:** on mobile, open pose sliders in a swipeable bottom sheet instead of a sidebar.
- **Responsive render dialog:** make `RenderDialog` scrollable and limit default size presets to max device resolution.
- **Viewport height fix:** use `dvh` units (dynamic viewport height) to prevent the control panel from being clipped by mobile browser chrome.

**Acceptance Criteria:**
- Full pose editing and render export flow is completable on a 390px-wide viewport (iPhone 14 Pro).
- Pinch-to-zoom and rotate work correctly in the 3D viewport on a touch device.
- No layout overflow or hidden controls on mobile.

---

## Goal 9 — Community Feed with Real-Time Data & Moderation

**Current State:** The Home feed is fully mocked (static post data). Stories, trending challenges, and post interactions (like, bookmark, follow) fire no API calls. There is no content moderation layer.

**What to Build:**
- Wire all feed interactions to real API endpoints (like, bookmark, follow, unfollow).
- Implement infinite scroll pagination for the feed (`GET /api/feed?page=&limit=`).
- **Stories:** connect story carousel to real user renders (`GET /api/stories`).
- **Trending challenges:** pull from `GET /api/challenges` with view/submission counts.
- **Basic moderation:** add a "Report" option on posts and renders; store reports via `POST /api/reports`. Flag reported content for admin review.
- **Notifications:** real-time badge on new likes/follows using Firebase Realtime Database or WebSocket.

**Acceptance Criteria:**
- Feed loads real posts and updates on interaction without page refresh.
- Infinite scroll loads the next page when the user reaches the bottom.
- A reported post is flagged in the backend and the reporter sees a confirmation.

---

## Goal 10 — CI/CD Pipeline & Production Readiness

**Current State:** No CI/CD configuration exists in the repository. Deployment process, environment promotion, and release strategy are undefined. No error monitoring or analytics beyond Firebase Analytics.

**What to Build:**
- **GitHub Actions workflow** (`.github/workflows/ci.yml`):
  - Trigger: every push and PR to `main`.
  - Steps: install → lint (ESLint) → type-check (tsc --noEmit) → test (Vitest) → build.
  - Block merges to `main` if any step fails.
- **Deployment workflow** (`.github/workflows/deploy.yml`):
  - Trigger: push to `main` (after CI passes).
  - Build Vite production bundle with injected env vars.
  - Deploy to hosting (Firebase Hosting, Vercel, or equivalent).
- **Error monitoring:** integrate **Sentry** for frontend error tracking. Capture unhandled exceptions and failed renders with user context.
- **Structured logging:** add a centralized error boundary in `App.tsx` that reports to Sentry and shows a user-friendly fallback UI.
- **Health check:** expose a `/health` endpoint on the backend that CI can ping post-deploy to verify the deployment succeeded.

**Acceptance Criteria:**
- Every pull request to `main` runs linting, type-check, and tests automatically.
- Merging to `main` triggers an automatic deployment.
- Sentry captures and groups frontend errors in production.
- Build time stays under 60 seconds.

---

## Priority Order

| # | Goal | Priority | Effort |
|---|------|----------|--------|
| 2 | Secure Secrets & Env Config | Critical | Small |
| 1 | Complete Backend API Integration | Critical | Large |
| 4 | Render Persistence & Gallery | High | Medium |
| 3 | Consolidate Character Rig System | High | Medium |
| 10 | CI/CD Pipeline & Production Readiness | High | Small |
| 6 | Add a Test Suite | High | Medium |
| 7 | Performance Optimization | Medium | Medium |
| 8 | Mobile Experience & Touch Controls | Medium | Medium |
| 5 | Complete Creator Space | Medium | Large |
| 9 | Community Feed with Real-Time Data | Medium | Large |

---

*Goals 2 and 10 are prerequisites for all others — secure config must be in place before any real data flows, and CI must be running before feature development scales up.*
