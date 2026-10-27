# 27 Oct · "Checking the package…" (Enrolled · paid / Renewed · paid) from the database — release 1290

**Before:** the form opened at once, but Save (Renewed) / the payment list (Enrolled) waited for Google's dry-run check:
Enrolled · paid median 13.3 s (max 25.5 s), Renewed · paid median 18.0 s (max 29.7 s), last 7 days.

**Now:** answered by edge function **coe-pkc** from docs **sys:pkglink** in ~0.4 s (preview, database simulated at 200 ms).
- sys:pkglink is written by Google (paste PKGLINK27, run 12:41, web app v442): ACTIVE incl. the column-J SALES links, SALES of the
  last 60 days + every linked row, DATABASE names — every ~2 min in the minute job and right after every paid save.
- coe-pkc ports Google's two dry checks line by line (mgmtRenewPaid / mgmtEnrolPaid with dry: true); deadline from the classes table.
- Used only if the copy is < 5 min old and no Enrolled/Renewed · paid save is waiting or finished after the copy (else Google, as before).
- Google's check still runs every time in the background; if it differs, Google's answer replaces the database one and the open form
  is refreshed from it (Renewed: e.g. switches to "already renewed"; Enrolled: list redrawn unless the user started typing).
  A Google error never overrides. Saves and Google's duplicate guard are unchanged.

**Exactness check (before release):** Google's own dry functions were run for every ACTIVE student (zzPkgCmp, read-only, 4 chunks)
together with a database copy taken in the same run, and compared with coe-pkc's code (op "cmp"): see the result below.

Rollback: branch rollback-pre-1290 (screens); delete coe-pkc → the app falls back to Google; the PKGLINK27 paste can stay (read-only copy).

**Result (27 Oct 13:15):** 236 students · Renewed check without teacher 236 · with each ACTIVE row's teacher 309 · Enrolled check 236 —
**0 differences, 0 deadline-only differences.** The temporary compare op was then removed from coe-pkc (v2) and the TEMP block
deleted from Code.gs by Misty. Released as patch 1290 (COE_V 1319), rollback-pre-1290.

Preview test (Google simulated at 6 s, database at 200 ms): Renewed · paid Save enabled after 0.36–0.44 s (was 6.1 s with a stale
copy, i.e. exactly as before); when Google's answer differed (a payment 2 days ago) the form switched to "already renewed" by itself.
Enrolled · paid payments listed after 0.39–0.48 s; when Google listed an extra payment the list was redrawn from Google.
Stability (management laptop+phone: To do, ACTIVE, Sales, Finance overview): all still (≤ 0.0026).
