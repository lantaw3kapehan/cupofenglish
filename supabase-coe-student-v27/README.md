# coe-student v27 (29 Oct 2026, 1546) — deployed source

= v26 with ONE file changed: `renew.ts` (the portal's renewal-month hold, guard 4). index.ts, mgmt.ts, pkg.ts byte-identical to v26/v25.
verify_jwt false, entrypoint index.ts. Rollback: deploy supabase-coe-student-v26/ (all 4 files).

核对中 only where the numbers really disagree. Four logic fixes (no records changed):
1. From Oct 2026 the taught units come from the calendar (coe_cls_days), the database counter's own source, not the DAILY sheet copy.
2. A shared teacher row is split at its own start day (its counter starts there), not the owner's.
3. A teacher row with no DAILY record in the renewal month (before Oct 2026) is not compared: there is nothing to compare with.
4. With no payment time recorded (coe_renew_at), classes on the start day may sit on either side (RULES-renewals: the payment time decides).

Staged on production data before deploy (coe-student-stage, same service key): v26 28 flagged → v27 12; 16 cleared; 0 added.
Live after deploy (op check): 201 students · 185 shown · 16 核对中 (was 32) · renewFlagged 12 · fake-token probes 8/8 → 401.
Tests: tools/renewal-suite.js 1546 cases (behaviour cases need Node ≥ 22.13; the v26 file fails 4 of them).
