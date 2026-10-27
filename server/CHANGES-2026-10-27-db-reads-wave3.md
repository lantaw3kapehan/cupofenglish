# 27 Oct 2026 · Database-first reads, wave 3 (release 1360, COE_V 1343)

Misty, 21:15: "YES! I have been telling you about these even before." Tonight's App health listed tGrowth 12.2 s ×97, tStudent 6.4 s ×207,
mgmtStudents 6.9 s ×35, mgmtStudent 4.7 s ×161 and mgmtNight 5.3 s ×73 as the slowest screens.

## What the timing log really shows (coe_speed, last 24 h)
App health averages every Google call, including the ones that run behind the screen. Split by whether someone was waiting:

| Screen | Waiting (ui) · median / p90 | Behind the screen (Google) · count · median |
|---|---|---|
| tStudent (teacher student page) | 248 · 0.63 s / 1.5 s | 57 · 4.6 s |
| tGrowth (teacher Growth) | 48 · 0.81 s / 2.0 s | 96 · 10.9 s |
| mgmtStudent (management student page) | 186 · 1.0 s / 2.2 s | 24 · 3.9 s |
| mgmtStudents (Students list) | 9 · 1.9 s / 3.6 s | 25 · 13.6 s |
| mgmtNight (night report) | — | 126 · 6.6 s |

So people already wait on the database (student pages and Students list are worked out by the database itself, sys:live);
the slow numbers are Google being asked again behind the screen.

## Why Google was still asked
- Student pages and the Students list: the database answer is dated by the oldest sheet copy it uses. TR-DATA and PR-DATA are
  copied only about every 2 h, so after 90 min the app treated the database answer as old and asked Google again (4–14 s each).
- Growth and the night report are still Google's own answers (stored in the database). The app refreshed them from Google every
  30 min (Growth) / 60 min (night report) per device.

## Release 1360
- Student pages (management and teacher), the Students list and ACTIVE: the database's own answer now counts as current for 6 h
  (was 90 min). A save still forces a fresh read for 2 min, exactly as before.
- Growth and the night report: still opened from the database copy at once; Google refreshes that copy at most every 3 h in the
  background (was 30 / 60 min).
- Nothing is calculated differently, so the numbers on screen are the same; only how often Google is asked behind the screen.
- Stability check (management + teacher, laptop + phone: To do/Today, Students, student list, Growth): 12/12 stable.
- Rollback: branch `rollback-pre-1360`.

## Still on Google, and why
- **Growth (tGrowth)** and **night report (mgmtNight)**: not rebuilt from raw tables yet (rank, pay ladder, evaluations, peer reviews,
  praise, penalties); an exact rebuild needs a line-by-line copy of the Apps Script logic and a check against Google. A new evaluation
  can now take up to 3 h to show on Growth (was 30 min) unless the teacher taps ↻.
- **Students list** waits 1.9 s median when opened: the database works the whole list out on every open (studentsLive). Not changed
  tonight.
- **timeIn (19 s) / classIn (8 s)**: Google's background copy of a save that the database already holds; nobody waits. Not changed.

## Not tested
- After-release timings: check coe_speed tomorrow (Google calls for tStudent / mgmtStudent / mgmtStudents / tGrowth / mgmtNight
  should drop sharply).
- No field-by-field check was run tonight: the data shown did not change source.
