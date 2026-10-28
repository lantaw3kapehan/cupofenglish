# 28 Oct · paid date, renewal validity, change stamps — releases 1422, 1423, 1424

## 1422 · "Renewed" = the payment date (Misty 11:13, Luna ST-2026-030: "Renewed Oct 31" → paid Oct 28)
- Renewed / New chips (Active table, Students list) show the SALES date of the sale linked to the package (ACTIVE col J →
  sys:pkglink, refreshed every 2 min); tooltip "Paid … · classes start …". No linked sale → the start date with "?" and a tooltip.
- Package start (first class) and valid-until unchanged. Lesson Summary: new line "Paid: … · 付款日期" under Package Starts.
- Checked 268 active packages: 184 linked to a sale, 77 of them show a different (earlier) date now; 84 not linked (shown with "?").

## 1423 · renewal picture valid-until (Misty 11:16, Luna: picture said 28 Nov 2026, a parent already disputed one)
- Cause: the picture took "Valid until" from the package row it was drawn from — right after a renewal still the OLD package.
- Now: first class of the new package (ACTIVE start of the row linked to this payment; or the row itself once it is the new one)
  + 4 months (< 30 lessons) / 8 (30–59) / 12 (60+), lessons = paid + free; month-end rule (31 Oct + 8 → 30 Jun, as the sheet).
  No start known yet → the line waits (no guess). Line added: "Counted from the first class · 有效期从首课 … 起计算".
- Luna: 28 Nov 2026 → **30 Jun 2027** (first class 31 Oct 2026, 30+3 lessons; same as the sheet's own deadline).
- Rule checked on 154 packages started in 2026: month length 4/8/12 by size matches all but one; ~70 sheet deadlines are a few days
  later than start + months (validity extensions/pauses) — the picture is only drawn at renewal, before any extension.
- App renewals in the last 60 days: 4 (writes). Luna — wrong (28 Nov 2026 → 30 Jun 2027). Anna ST-2025-034 — Google's quick answer at
  save time said 17 Jan 2027, correct 25 Jun 2027 (check what was sent). Leo ST-2026-101 (27 Oct 2027) and Gina ST-2025-047
  (21 Jun 2027) correct. Renewals saved directly in the sheet are not in this list.

## 1424 · change stamps (Misty 11:21: "why issues like these are being repetitive?")
- Database: coe_stamp + triggers on classes, coe_packages, sheet_rows, log_rows → docs 'sys:stamps' (one time per kind: classes,
  packages, lessons, sales, money, students, notes, timein, msgs, agree, reports). Every write bumps it, database-first saves and
  Google's catch-up copies alike.
- App: reads the stamps every 15 s while visible, on focus, and 3 s / 15 s / 45 s / 2 min after any save made here. A registry maps
  each kind to the caches it drops (saved copies, SB_FRESH answers, CLSM, AT, MN, DB) and the views it refetches (schedule, To do,
  Active, Students, money, student page, Schedule student window, lesson summary). Replace, never merge; never while typing.
- Not covered before (each needed its own fix until now): class move/cancel/add from another device or Google; renew/enrol → lesson
  summary + student page + Active; sales/expenses → money screens on other devices; notes/homework/reports → open student page;
  student record edits → Students; time-in → To do/Monitor (only Google's 30 s pulse for some kinds, never for DB-first saves).
- Regression test tools/regress-saves.js (run with the stability check): 10 save types × their stamps, stale copies planted → all
  dropped and refetched; plus the moved-class ghost, the valid-until rule and the paid-date helper. 17/17 pass; fails on the old app.

## Rollback
- Screens: rollback-pre-1422 / -1423 / -1424. Database: server/SQL-change-stamps-1424.sql (drop the five triggers).
