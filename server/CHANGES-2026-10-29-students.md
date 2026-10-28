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
