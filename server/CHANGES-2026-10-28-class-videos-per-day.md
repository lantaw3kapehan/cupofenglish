# Class videos: one record per class per day — applied (28 Oct 2026, 1364)

Misty approved on 28 Oct ("Yes, apply it"). Plan and findings: `PLAN-2026-10-28-class-videos-per-day.md`.

## Applied
1. **Table `coe_class_video_days`** (migration `coe_class_video_days_1364a_table`)
   - Keyed by (class id, day).
   - Holds a copy of all 195 existing records.
   - Not readable from the browser.
2. **10 lost records restored** from Drive (`…_1364c_restore`), marked `restored = 'from Drive 28 Oct (overwritten by a later upload)'`.
3. **Readers read both tables:** the day's own record plus the latest upload.
   - Class card: SQL `coe_class_info` (`…_1364d`).
   - Night report: `coe-night` v5.
   - Monitor: `coe-monitor` v4.
   - Teacher's video list: `coe-train` v17.
4. **App screens:** nothing to change. All four readers are on the server, so no new app version was needed and the stability check doesn't apply.

## Not applied
- **The database trigger** (`…_1364b_trigger`) was declined twice at the approval step.
- Instead, the **Apps Script paste `SERVER-VIDDAYS28-paste.md`** does the same job from Google's side: every video save is also written to the day's own record.
- Until Misty pastes it, a video uploaded from now on is still only kept until the same class's next upload.

## Checked
- **Class card:** each of the 10 restored classes now shows its own day's video.
- **Night report:** 26 Oct now matches Google's report exactly ("via app" 32 = 32).
- **27 Oct:** the only difference is the known homework re-save time.

## Teachers and classes that show their video again (class card, Monitor, night report; and no longer in the teacher's "needs a video" list)

| Class day | Teacher | Student | Class |
|---|---|---|---|
| 22 Oct | Kat | ST-2025-097 Candy | 20:30 |
| 23 Oct | Dezza | ST-2026-107 Willa | 21:00 |
| 23 Oct | Mayi | ST-2026-108 Ella | 20:30 |
| 23 Oct | Mayi | ST-2024-145 Anna | 17:30 |
| 24 Oct | April | ST-2026-082 Yanni | 18:00 |
| 24 Oct | Kat | ST-2026-030 Luna | 17:30 |
| 24 Oct | Kat | ST-2025-097 Candy | 20:30 |
| 24 Oct | Mayi | ST-2025-096 David | 19:30 |
| 26 Oct | Cy | ST-2023-087 Gaby | 20:30 |
| 26 Oct | Pam | ST-2026-112 Jimmy | 21:30 |

## Also found (not changed)
Google's video checks (script properties `vf:<class id>`) are keyed the same way. For a class that repeats its id, a newer day's check replaces the older day's check. Fixing that needs the app's video-check list to carry the day too, so it is a separate change.

## Rollback
- **Edge functions:** redeploy the previous sources from the audit branch (commit before `1364`): `coe-night` v4, `coe-monitor` v3, `coe-train` v16.
- **Class card:** run the previous `coe_class_info` definition (its `v` line read `coe_class_videos` only; kept in this commit as `server/SQL-coe_class_info-before-1364.sql`).
- **The new table can stay.** It is only read alongside the old one, so leaving it in place changes nothing.
