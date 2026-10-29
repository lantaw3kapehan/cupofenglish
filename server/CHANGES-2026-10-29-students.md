# 29 Oct 2026 · Students area and shared student dialogs · releases 1580–1586

Misty's Students audit (President). Correctness first, then simpler screens. Nothing stored was changed: no schema change, no data write,
no Code.gs change. Field names, ids, deep links (`#students`, `openStudent('ST-…')`), portal / partner views, pictures, messages, payroll
and shared packages are untouched. Each release has a `rollback-pre-NNNN` branch (= main just before it).

## 1580 · one learner profile (`coeLearner`) · item 1
- **Amy (ST-2026-021, 9, trial report "Young learner") showed "Adult · business" in Renewal · step by step.** Cause: patch 800 put the
  trial card's learner-type box, built from `TLD` (the last trial card opened, Will's), into the first `.tl4` box of any open card. The
  renewal steps on the student page use the same `.tl4` style, so they got Will's box, and a tap would have re-saved **Will's** report.
  Now only the trial card (`#tlAct`) gets it.
- **Will (ST-2026-123, trial report "Adult · business English", course BusinessEnglish, no age on DATABASE) got Kids & teens** in the trial
  card's Course plan / Price picture: those buttons passed no learner type and `isAdult()` only read age / grade.
  New `window.coeLearner(code, hint)` (script `coe-learner`): trial report learner type → DATABASE course → age (from birthdate) / grade →
  student list; plus market (PH via `isPhLearner`), exam (IELTS / PET / KET) and goal (daily / work / business). Course plan and Price
  picture use it only when the caller passed no learner type (an explicit type, `o.adult`, `o.ielts`, `o.group`… always wins: compatible
  with the Trials agent's 1562). `isAdult()` falls back to it (Will's messages are now addressed to him, not "Dear parent").
- Renewal form: the teacher came from `STU` (the last student page) when none was passed; now only if it is the same student.
- Stored data checked (read-only, 677 students on DATABASE, latest trial report each): see QA › Counts.

## 1581 · lesson units vs sessions · validity wording · items 2 and 3
- Student calendar said "20 booked after the 11 lessons left · the package ends on Tue, 30 Nov" (sessions against units, 11.5 → 11).
  Now units per class = minutes ÷ 50 to the half (the database's `coe_cls_units`; -TC / -SC count 0), shared as `window.coeUnits`:
  "31 classes booked (15.5 lesson units) · 8 classes (4 lesson units) booked after the 11.5 lesson units left run out · the lessons
  left cover the classes up to Tue, 11 Jan (estimate from the calendar) … The valid-until date is separate (see Package)."
  0 left now warns (was skipped); shared packages show no estimate (siblings use the same units); unknown left → nothing (核对中 rule).
- Every-week bar: "2 × 25 min = 1 lesson unit a week · Teacher X".
- Parent pictures (Lesson summary, lessons-left): "Validity ended July 7, 2026 · extended 114 days · 已延长114天" →
  "… · 114 days ago, lessons still left · 已过114天，仍有剩余课时". Where extensions live: an approved extension is a new Deadline Date in
  ACTIVE (col AX, with a note in NOTES); then nothing has "ended". The app has no other extension record. The student list / class
  chips already said "N days past · not an approved extension".

## 1582 · no stale student page over a newer card · item 4
- `STU` stays set after you open another card from a student page. Five late answers (save-stamp refresh, book change ×2, teacher chips
  ×2) redrew the student page whenever `STU.code` matched, replacing the card just opened. Now every redraw passes `stuCurrent(code)`
  (sheet open, opened for this student, showing its page or loading frame); otherwise it is skipped. Teacher app: same rule.

## 1583 · Enrolled · paid / Renewed · paid · item 5
- **Valid until on the renewal form counted carried lessons** (15 left + 15 new → "8 months"; rule 6 / ACTIVE formula use ENROLLED =
  new paid + free → 4 months) and both forms used `setMonth` (31 Oct + 4 → 3 Mar). Both now call `coeRenew.validFrom` (the one rule).
- **Check before saving**: Save renewal / Save enrolment show student, teacher, package (paid + free), carried, lessons after, paid on,
  method, partner (+ the student's SOURCE), invoice, first class, course, valid until, with warnings (partner CupOfEnglish but SOURCE is a
  partner, empty method, future paid date, no class booked, empty course with several books). Confirm and save / Edit; editing closes it.
- Enrolment: Course is pre-picked only when the calendar has exactly one book for the student (so lessons still count); Partner is
  never changed for you, the SOURCE is shown under it.
- Not touched (Trials agent's 1563 owns it): the Payment Confirmation dialog (issue / review / email). Payment time = the confirmation's
  generated time (renewal agent, 1542) — unchanged.

## 1584 · Students header
- "Database sheet · the raw rows…" link removed (same place as the Database sheet tab right above it). Package check stays under the title.
- Partner access + Student access → one **Access** menu (right of Package check). Same dialogs and ids (`paOpen`, `psOpen`,
  `#pa1340b`, `#ps1350b`). Escape / outside tap closes the menu.

## 1585 · Back / ✕ / Escape
- A card opened from another card: ✕ and outside went back one card, Escape closed everything. Now Escape = ✕ = Back. Going back to a
  student page re-opens it (fresh data, same scroll place) instead of a saved HTML copy that showed pre-save numbers.

## 1586 · one Back button
- Cards from the renewal steps showed two back buttons; the steps' "Back to X's page" was remembered 30 min and appeared on unrelated
  cards (e.g. Partner access from the list). Now one button; a fresh card forgets the old student.

## Links / consumers checked after each release
`#students` / `#active-students` open; `openStudent('ST-…')` from list, search, Today and trial card; Package check; Partner access and
Student access dialogs (ids unchanged); trial card Learner type box still on the trial card; Course plan / Price picture / CEFR from the
trial card and Enquiries (Enquiries unchanged: no student → no default); class notice, lessons-left picture, Lesson summary (shSummary
and `tabSheet('INDPKG')` → same), agreement, renewal steps (rnGo ×6); renewal form + 1540 guard (核对中 hold still applied after review);
regress-saves 17/17 (change stamps, ghost cleaner, valid-until rule, paid-date chip); renewal suite 44/44 in check.js; teacher students
screen stability. Not reachable here: student / partner portals (no portal code changed).

## Rollback
App: revert the patch (branches `rollback-pre-1580` … `rollback-pre-1586`). No data or server changes to undo.

---

# Follow-up · 1587–1589 (29 Oct, Misty 08:57 / 09:26 / 09:33)

## 1587 · the student page paints in its final form (Abby ST-2026-105: "show old then the new, it adjusts")
Measured per card open (preview, open a student, 6 s, every DOM change + layout shift; cached = kept copy, uncached = first open). All causes
were older than 1580 (same numbers on `rollback-pre-1580`):
- More actions (1000) folded the toolbar on a 60 ms timer: 86 px → 46 px, everything below jumped 40 px.
- Renewal steps inserted on a timer (+68 px), first "Renewal · step by step · 0 of 6 done", then a second painter's "Changes · step by step".
- Package bar added a frame later (+32 px); every ACTIVE refresh rewrote the Package box even when nothing changed.
- Status pill read the 1101 ✓ icon as part of the status: "✓Active" / "Active" flip (style too) on every refresh; same misread hid nothing
  but made renewal steps read "◷Trial" ≠ Trial.
- Status notes loading bar 36 px → "No notes yet." 20 px. Phone: the loading card was 174 px and grew to the full sheet.
Fix: those painters run inside the same draw; later timers find nothing to change; Package box redraws only when its content changes;
icon ignored; space reserved. "More actions" chevron is CSS now (the ▾ glyph showed as a dot).

| Card open (ST-2099-588) | before: changes after first paint · CLS | after |
|---|---|---|
| laptop, uncached | 7 · 0.0409 (toolbar/status/schedule 0.037) | 3 · 0.0007 |
| laptop, cached | 7 · 0.0139 | 1 · 0 |
| phone, uncached | 7 · 0.7373 (sheet growth 0.695) | 3 · 0.0082 |
| phone, cached | 7 · 0.0081 | 3 · 0.0082 |
(Remaining "changes" = data arriving in place: ✓ icon in the Package chip, lessons-left refresh; the 0.0007 / 0.008 is the Edit details button.)

## 1588 · YLE / Teens / Adults
Chip on every Students row (first line, after the code) and on the card next to the status. From `coeLearner`; IELTS → "· IELTS";
PH learner → "PH" inside the chip; unknown → muted "Type?" plus one App health line. Preview: 125 YLE · 74 Teens · 9 Adults · 1 Teens · IELTS
· 1 Type? of 210. Not added (optional): an All / YLE / Teens / Adults filter.

## 1589 · calm student header
Line 1 name (Fredoka One) · Chinese name · [YLE] [Active]. Line 2 ST code · age · grade · city · since Sep 2027, and a compact
"WeChat group" chip (copy icon; the group name on hover; same `wxCopy`). Line 3 Teacher · level · book · partner (management only, as before).
"Shares a group with…" → More actions (same `wxLink`). Stats: less padding, one baseline. Schedule: pills · "1 lesson unit a week"
(2 × 25 min · teacher on hover) · Next on the right. Phone: stats under the lines, WeChat chip after the teacher line, no sideways scroll.
No element is moved between rows (the older 21553 tidy re-sorts row children, so moving the WeChat chip there made it flip rows); placement
is CSS grid only. Header stable after first paint (0 changes in the header; CLS as 1587).

Checks: check.js + renewal suite each release; regress-saves 17/17 (1587, 1588, 1589 builds); stability students + astudents laptop/phone ok
(one phone run timed out under load, re-run ok). Copy group → clipboard "一杯英语 Jeoda (ST-2099-588)"; More actions › Shares a WeChat group →
"Shared WeChat group" card. Rollback: `rollback-pre-1587`, `rollback-pre-1588`, `rollback-pre-1589`.

## 1590 · learner filter · header polish
- Students list: "Learner" filter All · YLE · Teens · Adults with counts, under Source; remembered on this device (`coe.ltF`), applied before
  paint. Uses the 1588 chip on each row (same coeLearner decision); "Type?" rows show under All only. Teen IELTS students stay "Teens · IELTS".
- Student header: a wrapped meta line no longer starts with "·" (start-of-line separators are clipped); teacher name has no background.
- Design tokens (`--coe-*`, 1620–1639) used with today's values as fallbacks. Checks: regress-saves 17/17; card open CLS 0.0007 laptop /
  0.008 phone (as 1589); Students list stability ok (one laptop refresh 0.025 under load, re-runs 0.014 / 0.0009). Rollback `rollback-pre-1590`.
