# Wedify Backend — Audit TODO

## When finish it commit and push the check the task as done

## CRITICAL

- [x] **[auth] Fix Google OAuth callback — tokens sent as URL query params**
      `src/modules/auth/auth.controller.ts:109-111`
      `accessToken` and `refreshToken` appended to redirect URL → exposed in browser history, server logs, Referer headers. Use httpOnly cookies or a short-lived one-time code instead.

- [x] **[bookings] Fix cancel/complete missing authorization**
      `src/modules/bookings/bookings.controller.ts:73-84`
      `PUT /:id/complete` has no role/ownership check — any authenticated user can mark any booking complete. `cancel()` ignores `_userId` (`bookings.service.ts:137`). Add ownership validation in both methods.

- [x] **[admin] Guard seed() endpoint — it wipes all vendors**
      `src/modules/admin/admin.service.ts:474`
      `deleteMany({})` deletes the entire vendors table. Add an environment check (`NODE_ENV !== 'production'`) and/or a required confirmation flag.

---

## HIGH

- [-] **[auth] Implement forgot/reset password**
  `src/modules/auth/auth.service.ts:112-117`
  Both `forgotPassword()` and `resetPassword()` are empty stubs returning void.

- [x] **[admin] Fix listUsers() / getAuditLog() throwing raw Error**
      `src/modules/admin/admin.service.ts:479, 491`
      Throw `new NotImplementedException()` instead of `new Error('Not implemented')` — raw errors become unhandled 500s in production.

- [x] **[vendors] Fix uploadMedia() / getVendorStats() throwing raw Error**
      `src/modules/vendors/vendors.service.ts:125-131`
      Same issue — replace with `NotImplementedException`.

- [ ] **[payments] Implement payments module**
      `src/modules/payments/`
      DTO exists (`payment.dto.ts`) but there is no service, controller, or registered routes. Entire payment flow is missing.

- [x] **[schema] Add Prisma @relation directives**
      `prisma/schema.prisma`
      `Booking.coupleId`, `Booking.vendorId`, `Review.vendorId`, `Review.coupleId`, `Review.bookingId` are plain `String` fields with no `@relation` — no FK constraints, no referential integrity enforced by Prisma or the DB.

- [x] **[schema] Add @unique to Vendor.userId**
      `prisma/schema.prisma:31`
      `userId` is nullable and not unique — one user can create multiple vendor profiles.

- [x] **[schema] Add @unique to Vendor.slug**
      `prisma/schema.prisma:33`
      `slug` is nullable and not unique — duplicate slugs break `findBySlug()`.

---

## MEDIUM

- [x] **[auth] Fix Vendor.plan default inconsistency**
      `src/modules/vendors/vendors.service.ts:30` creates with `plan: 'BASIC'`
      `prisma/schema.prisma:38` defaults to `'BRONZE'`
      Pick one and align both.

- [x] **[auth] Read JWT expiry from config in issueTokens()**
      `src/modules/auth/auth.service.ts:129`
      `expiresIn: '15m'` is hardcoded — should read `JWT_EXPIRES_IN` from `ConfigService` (already used elsewhere in the same file).

- [x] **[admin] Fix dashboard stats returning zeros**
      `src/modules/admin/admin.service.ts:410-418`
      `totalUsers`, `totalBookings`, `averageSeoScore`, `pendingReviews` all return `0`. Query actual DB counts.

- [x] **[auth] Add stricter rate limiting on auth endpoints**
      `src/app.module.ts:25`
      Global throttle is 100 req/min — insufficient to stop brute force on `/auth/login` and `/auth/register`. Apply a tighter `@Throttle()` decorator (e.g. 5/min) on those specific endpoints.

---

## LOW

- [x] **[schema] Replace plain String with Prisma enums**
      `prisma/schema.prisma`
      `User.role`, `Vendor.status`, `Vendor.plan`, `Booking.status`, `Review.status` are all plain `String`. Define Prisma `enum` types for DB-level enforcement and type safety.

- [x] **[env] Verify Google OAuth credentials not committed to git**
      `.env:20-21`
      Real `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are present. Confirm `.env` is in `.gitignore` and rotate credentials if they were ever committed.
