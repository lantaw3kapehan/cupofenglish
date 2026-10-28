# 28 Oct · reschedule ghost + money "Saving…" + To do chip — releases 1420, 1421

## 1420 · a rescheduled class still showed at its old time (Misty 10:32, Freya ST-2026-069, 1 Nov 10:30 → 19:30)
**Root cause (database).** A move is saved in the database first (coe-mgmt › classEdit: the old row is deleted, the new one written)
and Google Calendar follows seconds later. Google's calendar → database copy (upsert per day + `coe_classes_prune`) that had started
*before* Google applied the move wrote the OLD class back and pruned the NEW one. For 1–2 minutes the class table (and every screen,
the parent and partner portals included) showed 10:30, or both times, until the next copy. Cancel/restore already had this protection
(`coe_classes_keep_fresh`, 21 Oct); moves did not.

**Fix.**
- Database trigger `classes_keep_moves` (migration `classes_keep_moves_1420`): for 10 minutes after a move (write new/busy/done), a copy
  can't re-insert the old time or delete the new one. A refused move (status error) is not protected, so the existing revert still
  works. Tested in a rolled-back transaction: stale insert of the old row skipped, prune of the new row skipped.
- Screens (patch 1420): every student class list is cleaned of a moved class's old copy (same event, start = its "moved from" time),
  whatever the source (database, Google, a saved copy); the Schedule student window reloads from the database 1.5 s after a move and
  replaces the device's saved copy; a stale saved copy opens clean.
- Preview test: list [old 10:30, moved 19:30 (from 10:30), next week 10:30] → [19:30, next week 10:30].
- Stability: 12/12 (management + teacher, laptop + phone: To do, Schedule, Students, Today, teacher schedule).

## 1421 · money entries "Saving…" (Misty 10:38) + To do chip (10:48)
- addExpense / addSale were already saved in the database at once (FAST_M since 16 Oct). The list greyed the row with "Saving…" until
  Google's copy came back. Now: full strength + "Saved · syncing" tag (pulsing dot) until Google's copy arrives. A refused save still
  gets the "Not saved" notice.
- Typical Google catch-up through the minute job today: 20–80 s (expense 2885: 37 s). Nothing was blocking: the queue drains every
  minute; the busy tGoalsSave ahead of it was processed in the same pass.
- Refunds (mgmtRefund) still save through Google directly (dry check first) — unchanged.
- To do summary tiles: an older rule moved the "Needs you" chip up 11 px (transform) onto "1 now" / "1 not followed up"; now in normal
  flow below the line. Stability 10/10 (To do, Schedule, Money, Finance overview, Expenses; laptop + phone).

## Rollback
- Screens: `rollback-pre-1420`, `rollback-pre-1421`.
- Database: `drop trigger classes_keep_moves on public.classes;` (functions can stay).
