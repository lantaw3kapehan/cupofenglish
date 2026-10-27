# What the app still reads from Google · inventory 26 Oct 2026 (night), updated 27 Oct (wave 2 + background lookups)

Misty, 22:27: "Ensure that those remnants we didn't migrate to Supabase Database, they should all be there. And all should be reading straight from Supabase Database."

Source: the app's own timing log (`coe_speed`, last 48 h). **Waits** is how many times someone was actually waiting on the screen (a tap less than 1.5 s before). **Median** is how long they waited. Timings of about 0.5–0.9 s mean the answer already comes from the database.

## 1. Already read straight from the database

| Screens | Waits (48 h) | Median |
|---|---|---|
| Schedule (management and teacher), student pages and their class lists | 1,678 · 871 · 799 · 718 · 494 | 0.5–0.8 s |
| Teacher page, Renewals, ACTIVE, Students list, Leave, Messages, Actions, Payroll | 224 · 259 · 45 · 23 · 101 · 94 | 0.4–0.9 s |
| Teacher Today data (`getBootstrap`), My schedule, homework history, goals, reminders, messages | — | 0.5–1.1 s |
| Lesson counts and history, ACTIVE monthly lines | — | database (26 Oct) |
| Progress-check form (`coe-pcf`), Growth (stored copy) | 10 · 191 | 0.5–0.6 s |
| Trials, reports waiting, To do, enquiries, money lists, the DATABASE screen | — | 0.4–1.2 s |
| Monthly feedback form (`tFbForm` → coe-train `fbform`, since 24 Oct) | — | database |
| Video checks and missing videos (`mgmtVidFlags`, `tVidFlags`, `tVidList` → coe-train, from `sys:vids`, which Google refreshes every ~5 min and within a minute of any review) | — | database since 25 Oct (the Google timings in the first inventory were from before that) |
| "Anything changed?" (`mgmtPulse` → coe-train `pulse`, since 25 Oct) | background | database; Google is still asked every 5 min only for changes typed straight into the sheets |
| Service agreement sheet (`mgmtAgree`, 26 Oct) | 49 | 13.0 s → under 1 s |
| Class sheet check-in details (`mgmtClassInfo`, 26 Oct) | 77 | 4.2 s → under 1 s |
| **New 27 Oct:** monthly-feedback helper (`tFbPlus` → `coe-fbp`) | 35 | **6.1 s → ~0.2–0.5 s** |
| **New 27 Oct:** trial report form (`tTrialForm` → `coe-trf`, after the TRIALPROPS27 paste) | 5 | 8.2 s → ~0.6 s |

Google still runs behind most of these screens to double-check them, but nobody waits for it.

## 2. Still answered by Google

| What | Waits (48 h) | Median | Why it stays on Google |
|---|---|---|---|
| `tPeerForm` (first open) | 12 | 0.7 s | Already fast (stored copy). |
| `mgmtTrialPdf`, `mgmtReportPdf`, `mgmtPcPdf`, `mgmtRoadmap`, `mgmtLeaveProof`, `mgmtBookCovers` | 1–14 each | 3.5–7.9 s | Files in Google Drive, not data — stay on Google by design. |
| `refresh` (↻) | 38 | background | Full re-check; the database copy is shown first. |
| `mgmtSlipPeople`, `mgmtMonDay`, `mgmtTeacherCard`, `mgmtPayroll`, `mgmtActions`, `tReminders`, `tMyVisits` | 3–20 each | only when the stored copy is too old | Database copies exist; Google answers only when the copy is old. |

## 3. Saves

Instant through the database since 27 Oct (coe-wq, release 1260 + INSTANT27 paste): service agreement, leave informed, class tag, late decision; reminder logs and the Enrolled/Renewed · paid save itself were already queued. Still direct: transfers and invoice files over ~2.5 MB; the package check before Enrolled/Renewed · paid (12–17 s) is being reviewed separately.

## 4. Google data the app needs that is not copied into the database

- `trp:` / `trredo:` (trial report sent / redo): **copied since 27 Oct** (`sys:trstate`, TRIALPROPS27 paste).
- **COURSEWARE** (book covers) and **Google Drive** files (videos found in Drive, PDFs, signed copies): files, they stay in Drive.
- `vf:*` video checks: **already copied** to the database (`sys:vids`, since 25 Oct).

## 5. Background lookups (27 Oct, release 1300, COE_V 1317)

Google calls nobody waits for, but which keep Google busy (48 h, before 1300): mgmtNight 482 · mgmtHealth 408 · mgmtTrialFus 386 · mgmtMyPay 385 · mgmtFixIgnored 370 · mgmtUrls 359 · schedLists 356 · mgmtPayChecks 326 · mgmtPayReady 264 · tGrowth 355 · tPayCheck 265 · tPayReady 257 (4–15 s each).

Release 1300: an unchanged Google answer now counts as a fresh copy on the device (Google only rewrites its copy when the answer changes); reads no longer count as saves; slower background spacing for slow, rarely-changing lookups; the My pay preload reuses the device's last answer (< 30 min). Preview: Google calls per management reload 8 → 0. Details: CHANGES-2026-10-27-background-reads.md.

Still always Google by design: the 5-min sheet-edit check in `mgmtPulse`, `getBootstrap` at app start, `tMsgs` double-check.

## How the feedback helper (`coe-fbp`) was checked

It is a line-by-line copy of Google's own code (`tFbPlus`, `gtTags_`, `gtGoalsAll_`, `gtActive_`, `gtMine_`, `fbMonth_`), reading the database copies of S-NOTE-TAGS and S-GOALS plus tags / goal plans saved in the app that Google hasn't copied yet. The app asks Google quietly once per student per day and compares: any difference is written to the activity log as **tFbPlusCheck**, and from then on that student uses Google's answer. Nothing on screen moves either way.
