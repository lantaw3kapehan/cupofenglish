# Night report from the database — release 1363 (28 Oct 2026)

Misty approved this at 23:27 on 27 Oct: Management › Night report (`mgmtNight`) comes from the database, behind a switch, and falls back to Google.

## What changed
- **Edge function `coe-night`**
  - A line-by-line port of Google's `mgmtNight` → `night_` → `recDay_`, taken from the live Code.gs read on 28 Oct.
  - It answers in the same shape, and the screen is unchanged.
  - Every time it is opened, it works the report out from the database:

| What | Where it comes from |
|---|---|
| Classes | `classes` (the calendar copy; the event itself is in `classes.data`) |
| Time-in / "I'm in" | `log_rows` T-TIMEIN (database original) |
| Homework, class notes | `log_rows` S-HOMEWORK / S-NOTES (database original) |
| Class videos | `coe_vid_log`, Google's own video check of month-DAILY links and Drive, written every 10 min. Videos uploaded in the app count the moment they arrive (`coe_class_videos`). |
| Names | MASTERLIST copy |
| Videos for days before 18 Oct, when the video log began | Google's stored answer for that day |

- **App (patch 1363):** `mgmtNight` asks `coe-night` first. If the switch is off, or anything fails, the app uses Google exactly as before.
- **Switch:** docs `sys:nightdb` `{"on": true}`. Turn it off with `{"on": false}`.
- **"Check again"** now always means fresh numbers; there is no 20-minute Google cache any more.

## Compared with Google's stored reports (15 days, 13–27 Oct)
- **27 Oct** (Google's report worked out this morning): identical except one homework time, 20:41 vs 20:40. See below.
- **26 Oct:** identical except the "via app" count (30 vs 32). The app does not show that count anywhere. The cause is the database problem listed below.
- **Older days:** the differences come from things added after Google worked its report out (homework and notes added later, videos found later), plus two real differences:
  1. **Videos found in Drive stay counted.** For any day before yesterday, Google stops searching Drive and only reads the month-DAILY links. A video it had already found in Drive therefore turns into "No video" in its report a day later. Example: 24 Oct, Julia ST-2026-115 and ST-2024-101, Ara ST-2024-114, Kat ST-2026-088 — all were found on 24 Oct. The database version keeps them, which is the correct answer.
  2. **Re-saved homework shows the later save time.** When a teacher saves the same homework twice, the database copy of S-HOMEWORK keeps one row with the later time, while Google's sheet keeps both rows and uses the first. Seen twice in 15 days: 1 minute and 27 minutes apart. The status (Right after / Same day / Late) was the same in both cases.

## Problems found (not changed)
- **`coe_class_videos` overwrites earlier videos.** Its primary key is the calendar event id alone. Some weekly classes use the same event id every day; for example Pam's ST-2026-112 21:30 class has one id on 26 and 27 Oct. Each new upload therefore replaces the previous day's video record, and the earlier record is lost from the table. The file itself stays in Drive and in month-DAILY. The fix is a key of (event_id, day) together with the writer's `on_conflict`. That needs the writer checked first.
- **The video log keeps a video once found.** `coe_vid_log.found_at` stays set even if the file is removed later. Seen once: Misty's own 25 Oct trial upload.
- **S-HOMEWORK database copy keeps the latest save, not the first** (see above). Fix: `log_put` keeps the first save time on conflict.

## Release
- `coe-night` v4 deployed (verify_jwt off; checks its own sign-in; management only).
- The server role was given read access to `coe_vid_log` (migration `coe_vid_log_service_read_1363`).
- Stability check, rollback branch `rollback-pre-1363`, `applied.txt` and CI: see the release commit.

## Rollback
Set `sys:nightdb` to `{"on": false}`. The app is back on Google at once, with no release needed. To remove the app change as well, revert to the branch `rollback-pre-1363`.
