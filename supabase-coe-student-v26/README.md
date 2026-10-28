# coe-student v26 (29 Oct 2026) — deployed source

= v25 (PH: Young Learners / Teens) with ONE file changed: `renew.ts` (= server/coe-student-renew-1540.ts).
index.ts, mgmt.ts, pkg.ts are byte-identical to supabase-coe-student-v25/ (PH changes kept). verify_jwt false, entrypoint index.ts.

renew.ts (portal 核对中 renewal-month guard, guard 4):
- planned (future) DAILY days are not counted as taught;
- the one renewal rule (RULES-renewals.md): a start-day class that ended before the payment time (coe_renew_at.at) belongs to
  the OLD package (coe_cls_days.hb).

Needs: `grant select on coe_renew_at to service_role` (server/SQL-renew-at-service-read-1544.sql, applied).

Checks after deploy: deployed source byte-equal to this folder (4/4); 8 fake-token probes → 401 AUTH;
op check: 201 students, 169 shown, 32 checking, renewFlagged 28 (was 34; cleared ST-2024-130, -139, -148, -152,
ST-2026-067, -072; none newly flagged).

Rollback: deploy supabase-coe-student-v25/ (all 4 files). China and PH behaviour otherwise unchanged.
