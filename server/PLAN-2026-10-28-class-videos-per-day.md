# Class videos: one record per class per day — findings and plan (28 Oct 2026)

**Status:** the database change was declined at the approval step on 28 Oct. Nothing has been changed yet; everything below is ready to apply.

## The problem
The app's video log (`coe_class_videos`) is keyed by the calendar class id alone. Some weekly classes keep the same id every day, so each new day's upload replaces the earlier day's record. The video files themselves are safe in Drive and in the month-DAILY tab. Only the database record is lost.

**Writer:** Google's Apps Script `tVidDone` → `POST coe_class_videos?on_conflict=event_id`. Reviews and notes are saved with `PATCH ...?event_id=eq.<id>`, so they also land on whichever day the record holds at that moment.

**Readers:**

| Reader | Where it shows | What the overwrite causes |
|---|---|---|
| `coe-train` "vidlist" | the teacher's "classes still needing a video" | asks the teacher again for a video they already uploaded |
| `coe-monitor` | management Monitor | shows no video for that day |
| `coe-night` | night report | counts "via app" one short |
| SQL `coe_class_info` | the class card | shows no video for that day |
| Code.gs `vids_` (2615 version) | — | not active: a later definition replaces it |

## Records lost (checked one by one in Drive; all were app uploads by works@, "Uploaded in the CupOfEnglish app by …")

| Class day | Teacher | Student | Class | Drive file |
|---|---|---|---|---|
| 22 Oct | Kat | ST-2025-097 Candy | 20:30 | ST-2025-097-Candy-October-22-2026-OD1.mp4 |
| 23 Oct | Dezza | ST-2026-107 Willa | 21:00 | ST-2026-107-Willa-October-23-2026-OD1.mp4 |
| 23 Oct | Mayi | ST-2026-108 Ella | 20:30 | ST-2026-108-Ella-October-23-2026-TheAlphabet.mp4 |
| 23 Oct | Mayi | ST-2024-145 Anna | 17:30 | ST-2024-145-Anna-October-23-2026-OD1.mp4 |
| 24 Oct | April | ST-2026-082 Yanni | 18:00 | ST-2026-082-Yanni-October-24-2026-OD1.mp4 |
| 24 Oct | Kat | ST-2026-030 Luna | 17:30 | ST-2026-030-Luna-October-24-2026-ShortVowels.mp4 |
| 24 Oct | Kat | ST-2025-097 Candy | 20:30 | ST-2025-097-Candy-October-24-2026-OD1.mp4 |
| 24 Oct | Mayi | ST-2025-096 David | 19:30 | ST-2025-096-David-October-24-2026-ShortVowels.mp4 |
| 26 Oct | Cy | ST-2023-087 Gaby | 20:30 | ST-2023-087-Gaby-October-26-2026-REF.mp4 |
| 26 Oct | Pam | ST-2026-112 Jimmy | 21:30 | ST-2026-112-Jimmy-October-26-2026-OD2.mp4 |

Four other repeated-id classes had videos that teachers uploaded to their own Drive (April / Mia, Christian / Rannie, Pam / Jun, Pam / Jane, all 22 Oct). Those never belong in this table and are not affected. For two of Julia's (Asher, Ollie, 22 Oct) the file can't be opened from this account; their names show they were not app uploads either.

Not recoverable for the 10 lost records: the md5 fingerprint, the automatic video checks (`flags`), and any review made before the overwrite. Every one was uploaded on the class day before 23:59, so none was late.

## The fix (additive; nothing is removed)
1. **New table `coe_class_video_days`**, keyed by (class id, day), filled from all current rows. A trigger on `coe_class_videos` copies every upload, note and review into that day's own record. Google's Apps Script keeps working unchanged. When a new day's upload replaces the row, a review of the old video stays with the old day and is not copied to the new one.
2. **Backfill** the 10 records above from Drive (file id, name, link, size, upload time, uploader), marked `restored = 'from Drive 28 Oct (overwritten by a later upload)'`.
3. **Readers** move to the per-day table: `coe_class_info` (in the same migration), `coe-night`, `coe-monitor` and `coe-train` (one line each).
4. **Apps Script paste (Misty, later):** add `&day=eq.<class day>` to the two PATCHes (video notes, video review). Then a review of an older day's video can't land on a newer day. Until then the trigger still keeps every upload separate.

The migration text is in the session (`coe_class_video_days_1364`). It needs approval to run.
