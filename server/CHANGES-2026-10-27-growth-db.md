# 27 Oct 2026 · Growth from the database (release 1361, COE_V 1345)

Misty approved (via coordinator, 27 Oct): port Growth (tGrowth) to the database.

## What changed
- New edge function **coe-growth** (verify_jwt off, own app_sessions token check). It is a port of Google's tGrowth:
  growth_ (this month / last month: time-ins, "I'm in", homework, progress checks, units, rank), qaAll_ (evaluations),
  career_ (rank, pay ladder, lifetime units, years, hire date), mgmtActions_ praise, attend_ (6 months from T-HISTORY) and
  liveCareer_/liveUnits_ (classes since the last S-MONTHLY sync, from the class table). Reads the database copies of
  QA-DATA, T-TIMEIN, S-HOMEWORK, PR-DATA, T-DASH, ACTIONS, T-HISTORY, MASTERLIST, S-MONTHLY. About 0.3 s per teacher.
- **Pay ladder as data:** docs `sys:ranks` (the six ranks, units and rates from CFG.RANKS). Editing it changes the ladder;
  if it is empty the built-in copy is used. (Google's own Growth still reads CFG.RANKS, so keep both the same.)
- **Still from Google's last answer** (stored in docs `<name>:tGrowth|[]`), labelled in the answer's `_src`:
  peer reviews (a Google Form, not copied to the database), class visits (the app acknowledges a visit by its exact saved
  time in milliseconds; the sheet copy rounds to seconds, so a database id could not be acknowledged), and the monthly
  record (needs class-video links Google reads from Drive and the DAILY tabs). The app still asks Google behind the screen
  when that copy is over 30 min old.
- **Exact times kept from Google:** evaluation `ts` (the app uses it to know an evaluation is new) and praise dates as the
  sheet displays them, whenever Google has already shown that item.
- **App (patch 1361):** tGrowth / mgmtGrowth go to coe-growth; Google when the switch is off or on any error.
- **Switch:** docs `sys:growthdb` `{"on": true}` (on since release). Off = Google exactly as before.

## Field-by-field check (op 'check', all 14 stored Google answers)
After the fixes: every field matches in shape, evaluations, career, ladder, praise and attendance history except values that
changed after Google's copy was made (Google's Growth is itself cached up to 6 h):
- classIns / classOnTime / timeIns / onTime: database higher by 1–4. Counting the database's time-ins only up to the
  moment of Google's copy gives Google's number for 13 of 14 time-in counts (Cy 4 vs 5: a time-in at the edge) and is within
  1–3 for "I'm in" (Google's answer is computed before the copy is stored).
- homework: the database copy of S-HOMEWORK starts on 8 Oct (Dezza 101 vs Google 121, Ara 65 vs 106). **Fixed (coe-growth v4):**
  homework this month and last month are taken from Google's stored answer, labelled `_src.google.homework`, until the
  database holds the full history. No database table holds it: `writes` has markHomework only since 14 Oct (358 saves);
  there is no homework table or archive copy (Apps Script archives S-HOMEWORK only after 400 days). T-TIMEIN's copy also
  starts on 8 Oct, but Google's own counts match it, so time-in counts are unaffected. Homework is display-only on Growth
  ("homework given"); rank, rate, units and pay come from T-DASH and do not use it.
- attend (current month) and kpi.units: the T-HISTORY / T-DASH rows for today changed after Google's copy.
- praise.when for Mayi (3 Sep): fixed in v4 (two items with the same subject and day are now matched one-to-one).
- Re-run after v4: the only differences left are time-dependent (time-ins / "I'm in" after Google's copy, today's T-HISTORY /
  T-DASH values); 2 of 14 teachers identical.
Bugs found and fixed during the check: T-HISTORY header handling dropped one row per teacher; evaluation and visit times
lost their milliseconds.

## Note for Misty
New evaluations reach Growth when QA-DATA is copied to the database (every 1–2 h). Follow-up proposal: route the
evaluation save itself through the database (like time-ins), so a new evaluation shows within a minute. Not done now.

## Rollback
- App: branch `rollback-pre-1361` (or set `sys:growthdb` to `{"on": false}` — immediate, no release needed).
- Server: edge function coe-growth can stay; with the switch off it answers `fallback`.
