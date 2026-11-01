# ACTIVE gets a new month column · 1 Nov 2026

**What happened (1 Nov, 13:15):** Google's ACTIVE got the November month column (index 44), moving SUB CLASS, TOTAL FINISHED,
TOTAL AVAILABLE, NOTES/active, Purchase date, Deadline, Shared, Source, Renewal status and Course one place right.
The database package sync (`coe_pkg_sync`, `coe_pkg_rows`, `coe_pkg_subs`, `coe_cell_same`, `coe_portal_pkgs`) read them at fixed
places (44–55), so:
- the app's ACTIVE copy showed finished = sub-classes and lessons left = finished (Jena ST-2026-109: "0 + 33 − 28 used ≠ 28 now",
  every lessons-left picture held);
- all 320 packages got active = false, shared = a date, source = the resolved code, renewal status = the source;
- at 13:24:57 318 "sheet fix kept" set each package's deadline to its purchase date (deadline_set = true).
No lesson numbers (fin_adj / avail_adj) were changed.

**Fix (migrations coe_active_cols_helper_1101, coe_active_cols_follow_header_1101, coe_portal_pkgs_follow_header_1101,
coe_active_mirror_keeps_layout_1101):**
- `coe_active_sub()` finds SUB CLASS in the ACTIVE~ header; `coe_acol(k)` maps the old place k (44..56) to today's.
  The sync functions read Google's copy (ACTIVE~) through it; `coe_pkg_sync` skips if SUB CLASS is not found.
- The app's copy (sheet_rows 'ACTIVE', written by `coe_pkg_mirror`) keeps the old layout: `coe_active_fix()` leaves out the oldest
  month columns (Jan 2024 …), one per new month. Edge functions that read fixed places keep working.
  `coe_active_screen` names the months from the dropped count (now Feb 24 … Nov 26) and reads Google's month cells at 10 + extra.
- Repair: package fields re-read from the sheet (sync). The 318 deadlines: reset to the computed deadline, and set from the sheet
  (deadline_set) only where the sheet's deadline differs from it (72). Backup of the wrong values: table `coe_pkg_dl_backup_1101`.
- Check after: 0 pending, renewal check 2 notes (Lucy, Mia valid-until, as before), Jena ACTIVE: 5.5 finished · 28 left (0.5 returned) · valid until 24 May 2027.

**Still to do (Google):** SRCFIX31 writes Source at ACTIVE column 53 (BA) only if row 1 there says SOURCE. Source is now column 54
(BB), so the Source fix after an enrolment does nothing until it looks the column up by name.
