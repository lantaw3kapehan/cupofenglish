# 29 Oct 2026 · Trials and Enquiries · releases 1560–1565

Misty's audit (President): correctness and daily use first, then simpler screens. Keep every function, change as little information as
possible, keep every existing link working. QA inventory: `server/QA-2026-10-29-trials-enquiries.md`.

## Will (ST-2026-123): why the trial showed a missing report

- Calendar event `lkj78liol51dio9hr795i5iegs` was booked for Sat 24 Oct 10:00 and moved by Operations to Sun 25 Oct 10:00 (APP LOG
  23 Oct 21:58). The class was held on 25 Oct (T-RECORD row with the same event id), and Misty's report is dated 25 Oct and was sent.
- TC&SUB still logs the trial on **24 Oct** (row 13, same event id). Google's `mgmtTrials` builds "No report yet" by comparing the
  TC&SUB date + name with the report date, so 24 Oct had "no report". The report and the trial are the same session; only the
  matching rule was wrong. No record was wrong, and none was changed.

## Same pattern across all trials (database copy, read-only SQL, 29 Oct)

TC&SUB "Trial" rows since Jan 2025: **426 log rows = 231 class sessions** (195 rows are a second copy of the same session: TC&SUB holds most
trial rows twice, same event id and date).

| Session vs report | Sessions | Who (recent) |
|---|---|---|
| Report on the same day | 195 | — |
| Moved in the calendar, report on the new day | 3 | Will 24→25 Oct, Eric 11→12 Oct, Jimmy 21→24 Sep |
| Moved to a later day, not held yet | 1 | Haochen 26→31 Oct |
| Other session of the same student, a report within −14…+30 days | 5 | Eric 18 + 19 Oct (after his 12 Oct report, enrolled), Eleven 2 Aug (report 1 Aug), Jasper 12 Jun, Leo 24 May |
| No report at all | 27 | mostly 2025; 2 in the last 45 days (Yona 24 Sep, Dezza; 27 Sep, Ara) |

On 29 Oct Google's "No report yet" listed 4 trials: Will 24 Oct (moved, reported), Haochen 26 Oct (moved ahead), Eric 18 + 19 Oct
(repeat entries after a report). **None is a real missing report.** Yona's two September sessions have no report but are not in Google's
list (it only looks back about two weeks) — decision for Misty below.

## 1560 · trial ↔ report by session (calendar event id)

- coe-trials **v11** (deployed 29 Oct; source `server/coe-trials.ts`): `recon` (management, read-only) returns each Trial session of the
  last 75 days by event id with where the event is now (day, cancelled, moved from), and the trial reports.
- The Trials screen classifies each "No report yet" entry by its session: moved + report on the new day → not listed, the report row says
  "rescheduled from Sat 24 Oct"; moved to a later day → not listed (Booked trial classes shows it); cancelled event → "Cancelled?";
  another session of the same student already has a report → kept, amber **Check** ("another booking has the report (Mon 12 Oct)"),
  never merged; otherwise **No report yet**. Real missing first.
- An enquiry linked to the old date ("24 Oct|Will") now finds the report on the new day (chip "report sent").
- If the session list cannot be read, the screen is exactly as before. Kept on the device for instant open, refreshed every 5 minutes.

## 1561 · Trials: one status row, next step, Results

- One row: To send · No report yet · Follow up · Being made · Enrolled · Not enrolling · All · **Results**, with Source as a small menu at
  the end (was a second row of chips). Same counts and handlers.
- **Results** holds the conversion analytics (45 days / year / all time, tiles, by teacher, CEFR); they no longer sit under the list.
- **Next step** on every trial: "Next · what · who · when", late in red. Worked out automatically (no report → Write the report · teacher ·
  day after the trial; ready → Send the report · Operations; sent → First follow-up · Operations · 2 days after sending; follow-up set →
  Follow up again · 3 days later; Check → Check the booking · today; enrolled / not enrolling → none). Tap to set what / who / when or go
  back to automatic. Saved in docs `sys:trial_next` (new row, coe-trials `setNext`, management only). Follow-ups, reports, enquiries
  unchanged.
- Phone: booked-trial chip and each row's level / status wrap under the name (names were squeezed to one word per line).

## 1562 · dialogs from a trial use the learner's type, market and course

- Price picture / Course plan / CEFR from a trial pass the report's learner type explicitly, and it wins over anything remembered:
  Adult (any) → Adults (Course plan goal Daily / Work / Business from the type); Young learner / Teen → Kids & teens. Will (Adult ·
  business English) → Adults · Business. No type on the report → unchanged.
- PH learner (Student access › Market = Philippines) → the PH price list / roadmap on their programme and track (PH toolkit unchanged).

## 1563 · Payment Confirmation: review → issue → email separately (shared dialog: Add sale, Enrolled · paid, Renewed · paid)

- The form button is **Review Payment Confirmation N**: a review of number, date, bill to, address, lines, total, tax, paid, method, email.
  **Issue** from the review (replaces the browser confirm). Issue = the same database call and fields as before (the issue time stays the
  renewal payment time, `coe_renew_at`); it **no longer emails**. After issuing: **Email to <address>** (own confirm) sends the PDF of that
  confirmation only — no new confirmation, time unchanged. Void, numbers, tax, attach-to-form, All payment confirmations: unchanged.

## 1564 · Enquiries

- Days since logged in Philippine calendar days, never below 0 (between midnight and 8 am a new enquiry showed "-1 days"); "1 day" / "N days",
  "1 day quiet".
- A name or contact that is a web link shows as "Messenger · …901234" and stays a link (new tab, full address on hover); sheet titles use
  the short text and wrap.
- Summary cards open what they count: **Logged** → all logged (was Open, which hides enrolled and Not now); **Reached trial** → everyone who
  reached a trial (was Trial booked only). The opened card is marked.
- Philippine enquiry rows: Trial invite copies the PH toolkit's English invitation (same "sent" log), Inquiry form is English-only, the
  China-only CEFR button is hidden. China rows unchanged; Market switch and PH content untouched.
- Phone: row actions wrap as compact buttons (were 11 full-width buttons per enquiry).

## 1565 · Payment Confirmation entry card

- "Make payment confirmation" card: "Review, issue, then email it separately. The PDF is attached here." and a line receipt icon (was 🧾 and
  "…emailed to the parent").

## Links and consumers checked (Misty 03:38)

- trial ↔ report: report rows, `tlOpen`, `TRL.rows` untouched; only the in-memory "No report yet" list is reclassified (`TRL._rcAll` keeps
  Google's list). Teacher "Write report" (coe-trials default path, 1140 window) unchanged — v11 adds two branches before it.
- trial ↔ student: `openStudent`, Enrolled · paid (`enSheet`), Set class schedule, Class notice, Agreement from the trial: all open (QA).
- enquiry ↔ trial: `enqLink` / `trialOf` keys (`date|name`) unchanged; old-date links resolve through the move (`trRecon1560.alias`).
- Payment Confirmation ↔ renewal time: `call('issue')` unchanged and called once at Issue; email = `mailInvoice` + `mailed` only
  (tools/regress-trials.js checks 1–7).
- PH toolkit: `pricePic({ph})`, `phRoadPic`, `phInv`, `agrOpen` PH detection, Market switch: called, not changed. China pictures untouched.
- Deep links: `#trials`, `#enquiries`, `#student=…` unchanged. Follow-ups (`mgmtTrialFu` keys) and enquiry saves (`mgmtEnqSave`) unchanged.

## Database / server

- coe-trials v10 → **v11** (deployed; probed with a fake token: `recon` and `setNext` → 401 AUTH). No schema change.
- docs `sys:trial_next`: new row, created on the first "Next step" save (none saved yet).
- No Apps Script change (no paste file). Google's `mgmtTrials` still compares dates; the app corrects the list by session.

## Tests

- `tools/check.js` OK · `tools/regress-saves.js` 17/17 · `tools/regress-trials.js` 20/20 (new: Payment Confirmation, trial matching,
  trial dialogs, Enquiries) · stability (management trials, enquiry, mtoday, astudents · laptop + phone) base vs new all ≤ 0.02.
- Sample data: `tools/trials-fixture.js` (made-up names; mirrors Will / Haochen / Eric / a real missing report / two real trials).

## Rollback

- 1560 · 1562 · 1563: branch `rollback-pre-1560`. 1561 · 1564 · 1565: branch `rollback-pre-1561`.
- coe-trials: redeploy `server/coe-trials.ts` from `rollback-pre-1560` (v10). The new branches are unused by older app versions.
- Data: `delete from docs where key = 'sys:trial_next'` (new row only).

---

# 1566 · Trial dialog layout (Misty 08:56, Will's dialog on a laptop)

- **Cause:** the trial card's action area (`#tlAct`, `.rp-act`) still had `position:sticky; bottom:-1px`, a rule meant for a short button
  bar. Since the step list moved into it, the area is about 1,000 px tall, so "sticky to the bottom" pinned it upward. It covered the title
  (its top border was the stray line), it sat over the inline PDF and the "More" row, and the dialog seemed not to scroll.
- **Shared sheet shell:**
  - A step list inside a sheet (`.sheet .rp-act.tl4`, or any `.rp-act` holding step rows) is now in normal flow. The short sticky bar on
    the parent report is unchanged.
  - Chip rows in sheets (`#sheet .seg`) had a 999 px radius with overflow hidden, which cut the first chip's left edge and the selected
    chip's border. They are now square, not clipped, and wrap.
- **Trial dialog:**
  - The report PDF preview opens on demand ("Show the PDF here" / "Hide the PDF"), inside the flow, with one scroll container.
  - "After sending" steps continue the numbering (5, 6, …; ✓ when done) instead of a bare "·". That "·" was literal text, not a missing
    glyph.
  - Coming back to the same trial within 10 minutes restores the scroll position.
- **Checked at 1440 × 900, 1366 × 768, 1280 × 720, 1024 × 768 and 390 × 844:**
  - title fully visible (22 px from the top of the sheet);
  - the step list is static;
  - the PDF frame overlaps no other row;
  - no sideways scroll.
- **Tests:** regress-trials 20/20 · regress-saves 17/17 · stability trials / astudents / reports, laptop + phone, matches base (one phone
  reports shift under load did not repeat, 0 on two re-runs).
- **Rollback:** branch `rollback-pre-1566`.
