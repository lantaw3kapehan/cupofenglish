# System notice for late check-ins · 1670–1671 · 29 Oct 2026

Approved by Misty (President) at 19:14: "ensure language is standard and policy-based". The addition about system evidence for management was also approved by Misty.

## What changed

**Teachers (1670).** When a **Late time-in** or **Late to class** is recorded, the teacher gets an automatic notice in her own app:
- on **Today**, directly under "Needs your action". The red "pending review" line is gone. Needs your action now has one row, "Late to Class · recorded by the system", whose button is "Submit proof or reason";
- on **Pay › Punctuality**, where undecided lates are shown in full. Decided lates are folded into one line each, and tapping the line opens the full notice.

Each notice includes:
- the header "System notice · automatic";
- the facts: class (student first name, start time), her "I'm in" or time-in time, minutes late, her device and her internet at that moment;
- her own screen picture from the moment she tapped (a link to the Drive file);
- the policy rule;
- the outcome, using the real POLICY amount for her rank (New or Regular) and the demerit points for her tier from POLICY. Once a decision exists, the outcome shows that decision instead: Excused, Unexcused or Waived, with the amount and the case ID. Teachers are never shown who made the decision.

The teacher has one button, **Submit proof or reason**:
- reason, required, up to 500 characters;
- a picture, optional but encouraged.

She can submit only once. After that the notice shows "Submitted · waiting for management" and her reply. She cannot submit once the late has been decided.

**Management (1671).** Each late in **Overview › Lates to decide** and in **Monitor › Time-ins › To review** shows two new items:
- **the teacher's reply**: the reason, the picture and when it was submitted. If there is none, it says "No reply from the teacher yet.";
- **one "System check" line** from the database, covering the period from 5 minutes before the deadline to the check-in (at most the last 4 hours). It shows:
  - her app activity: taps and screens, from `coe_speed`;
  - any saves that failed, waited or were retried (status, tries and error, from `writes`);
  - an app reload for an update (a version change in `coe_speed`);
  - when her check-in was received and saved;
  - how many other teachers' check-ins in the same period saved normally. This is a count only, with no names.

The decision is still made with the Excused / Unexcused / Waive buttons (decideLate). These are unchanged: POLICY, the amounts, `decideLate` and `autoLateUnexcused`.

## Exact wording (teacher)
- Header: `System notice · automatic`
- Title: `Late to Class · recorded by the system` / `Late time-in · recorded by the system`
- Facts: `Class` (or `First class`) · `"I'm in"` (or `Time-in`) · `Minutes late` · `Device` · `Internet` · `Your screen at HH:MM — Recorded when you tapped · open`
- Rule: `Policy: tap "I'm in" by the class start. No grace period.` / `Policy: time in at least 30 minutes before your first class.`
- Outcome before the decision: `If not excused within 24 hours this becomes Unexcused · −₱{POLICY amount} and {n} demerit points.` + `Deadline: Fri, 30 Oct, 18:56`
- Outcome after the 24 hours but before the hourly job runs: `Not excused within 24 hours. At the next hourly check this is recorded as Unexcused · −₱{amount} and {n} demerit points.`
- Outcome once decided: `Decision: Unexcused (not excused within 24 hours) · −₱300 · Case OAR-2026-127` / `Decision: Excused · −₱100 · Case …` / `Decision: Waived · no deduction`
- Button: `Submit proof or reason` → after submitting: `Submitted · waiting for management` and `Your reply · submitted …`
- Form: title `Submit proof or reason`; `Reason (required)`, with the placeholder `State what happened, with times if possible.`; a 0 / 500 counter; `Proof picture (optional, recommended)`, with the hint `For example, a screenshot that shows the time, or a notice of a power or internet outage.`; the note `You can submit once. Management reviews it with the system record and decides: Excused, Unexcused or Waived.`; and the buttons `Submit` and `Cancel`. If no reason is written, the error is `Write the reason.`

## Storage and server
- **Table** `public.late_explain`: RLS is on, there are no policies, and only service_role has grants. There is one reply per teacher per late (a unique index on `lower(teacher), late_at`). The SQL and the rollback are in `server/SQL-late-explain-1670.sql`.
- **Storage bucket** `late-proof`: private, image only, with a 600 KB limit. The app keeps pictures under 400 KB as JPEG. Links are signed and expire after 1 hour.
- **Supabase function `coe-late`** (`server/coe-late.ts`): it does its own token check against `app_sessions`, like coe-train and coe-chat, and is deployed with verify_jwt off like the others. It has three actions:
  - `mine` (teacher): her own lates and replies only;
  - `submit` (teacher): her own undecided late, and only once;
  - `mgmt` (management only): replies and System check lines.

  The function reads only the database. It makes no Google calls.

## Speed and stability
- **Teachers:** the existing `lates` read (coe-train) is replaced by `coe-late mine`, which is also database-only. coe-train is used only as a fallback if coe-late fails, so a teacher makes no extra calls.
- **Drawing:** the notice is drawn from the copy saved on the device, inside the existing paint that runs with renderToday and renderPay. No new observers were added.
- **Font sizes:** these use the 901 type-scale tokens (`var(--fs-…)`), so the later text pass cannot resize them. A px size was tested first and caused a 0.019–0.034 shift on the phone Overview.
- **Pictures:** each picture sits in a fixed-size box.
- **Management:** one extra coe-late call happens, and only while there are lates to decide. The results update the blocks in place, and the picture link is kept for 45 minutes.

## Tests (sample data only; nothing was saved for real)
- `t1670.js` (preview), 48 of 48 passed. It covers, on laptop and phone:
  - the teacher's pending, submitted and decided states on Today and Pay;
  - the form: reason required, 500-character limit, a JPEG under 400 KB, one submission only;
  - the row in Needs your action;
  - the management Overview and Time-ins blocks;
  - no page errors and no horizontal overflow.
- Local server test of `coe-late` against an in-memory database, 19 of 19 passed. It covers:
  - the token check;
  - a teacher sees only her own rows and replies;
  - she cannot submit for another teacher, or for a decided late;
  - empty reason, more than 500 characters, and non-image files are refused;
  - submit once;
  - management only for `mgmt`;
  - the exact System check line;
  - no other teachers' names in the line.
- Live read-only check of `mgmt` on Julia's real late of 29 Oct (OAR-2026-127). It returned: `System check: app active 18:26, 18:55, 18:56 · no taps 18:27–18:54 · app reloaded for an update (v1478 → v1480) at 18:55 · no failed or waiting saves · …`. The first version picked her next class's check-in (18:56:56 for Ollie); this was fixed so it picks the check-in sent closest to the late.
- `tools/check.js`: OK, 502 scripts, all 48 renewal checks passed.
- `tools/regress-saves.js`: all 17 passed.
- Stability check on Today, Pay, Overview, Time-ins and To do, laptop and phone: all 10 screens stable. Refresh/open movement was at most 0.0037 and the limit is 0.02.
  - **Pre-existing:** Pay on laptop sometimes shows a 0.033 shift of the Punctuality section at about 2 s. It also happens on main without this change (2 of 5 runs on main, 1 of 5 with it).

## Rollback
- **App:** branch `rollback-pre-1670` = main before this change (33eaf75). Revert the release commit, or add a patch that undoes 1670/1671.
- **Function:** `coe-late` can stay; nothing calls it after a rollback.
- **Database:** only if wanted, see `server/SQL-late-explain-1670.sql`.

## For Misty to decide
1. **Response window:** right now the teacher can submit any time until the late is decided. That is up to 24 hours, then `autoLateUnexcused` records it as Unexcused. Choose one:
   - keep it like this;
   - close submissions earlier, for example 12 hours;
   - allow a reply after an automatic Unexcused (an appeal).
2. **Excused amount for New teachers:** POLICY has Excused ₱0 for New and ₱100 for Regular, but the brief said "Excused ₱100 for all". The app uses POLICY as it stands.
3. **Demerits on Excused:** `penalty_` writes the tier's demerit points on the case for Excused too. The notice states demerit points only for the Unexcused outcome. Should Excused carry demerits?
4. **Screen picture thumbnail:** the "I'm in" picture is a Drive file. The small preview shows only if the teacher's browser can open that Drive file; otherwise a picture icon and the link are shown.
