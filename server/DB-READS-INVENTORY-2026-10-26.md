# What the app still reads from Google · inventory 26 Oct 2026 (night)

Misty, 22:27: "Ensure that those remnants we didn't migrate to Supabase Database, they should all be there. And all should be reading straight from Supabase Database."

Source: the app's own timing log (`coe_speed`, last 48 h). **Waits** is how many times someone was actually waiting on the screen (a tap less than 1.5 s before). **Median** is how long they waited. Timings of about 0.5–0.9 s mean the answer already comes from the database.

## 1. Already read straight from the database

These screens open from the database, which works the answer out itself from the copies of the sheets. The median wait is 0.4–0.9 s.

| Screens | Waits (48 h) | Median |
|---|---|---|
| Schedule (management and teacher), student pages and their class lists | 1,678 · 871 · 799 · 718 · 494 | 0.5–0.8 s |
| Teacher page, Renewals, ACTIVE, Students list, Leave, Messages, Actions, Payroll | 224 · 259 · 45 · 23 · 101 · 94 | 0.4–0.9 s |
| Teacher Today data (`getBootstrap`), My schedule, homework history, goals, reminders, messages | — | 0.5–1.1 s |
| Lesson counts and history, ACTIVE monthly lines | — | database (26 Oct) |
| Progress-check form (`coe-pcf`), Growth (stored copy) | 10 · 191 | 0.5–0.6 s |
| Trials, reports waiting, To do, enquiries, money lists, the DATABASE screen | — | 0.4–1.2 s |
| **New tonight:** Service agreement sheet (`mgmtAgree`) | 49 | **13.0 s → under 1 s** |
| **New tonight:** Class sheet check-in details (`mgmtClassInfo`) | 77 (+3 errors at 13.5 s) | **4.2 s → under 1 s** |

Google still runs behind most of these screens to double-check them, but nobody waits for it.

## 2. Still answered only by Google, and someone waits

| What | Screen | Waits (48 h) | Median | Why it is still on Google / what is needed |
|---|---|---|---|---|
| `tFbPlus` | Monthly feedback helper (tags, last month's plan, my plans) | 35 | 6.1 s | Can be built from S-NOTE-TAGS, S-GOALS and the FEEDBACK DATA copy, but not verified tonight. **Next.** |
| `tMyVisits` (when the copy is old) | Teacher's observation visits | 13 | 6.8 s | The database version exists, but Google still answers when the copy is older than allowed. Can be lengthened, as was done for Growth. |
| `tTrialForm`, `tFbForm`, `tPeerForm` (first open of a student) | Trial / monthly feedback / peer review forms | 5 · 7 · 12 | 8.2 · 5.3 · 0.7 s | Usually fetched ahead in the background. A database version of tFbForm needs the Google Form's question list (it rarely changes); progress checks were done the same way. |
| `mgmtTrialPdf`, `mgmtReportPdf`, `mgmtPcPdf`, `mgmtRoadmap`, `mgmtLeaveProof` | PDF and picture files | 12 · 14 · 1 · 6 | 3.5–7.9 s | **Stays on Google by design:** these are files in Google Drive, not data. |
| `mgmtVidFlags`, `tVidList`, `tVidFlags` | Video checks / missing videos | 11 · 1 · 1 | 3.2 s (mostly in the background) | Needs a Google paste first: management's review decisions live in Google's Script Properties (`vf:*`), not in a sheet. |
| `mgmtPulse` | "Anything changed?" check every 30 s (management) | 15 (546 in the background) | 3.0 s | Reads Google's APP LOG live. The database copy of APP LOG is about 1.5 h behind, so it can't be swapped without a faster copy. |
| `classCheck` | Clash check when moving or adding a class | 34 | 0.4 s | Already fast. |
| `refresh` (↻ button) | Full re-check from Google | 38 | 26 s, but in the background | Management and teachers already see the database copy first. Google's full re-check runs behind. |
| `mgmtSlipPeople`, `mgmtMonDay`, `mgmtTeacherCard`, `mgmtPayroll`, `mgmtActions`, `tReminders` | Pay slips, monitor day, teacher card… | 3–20 each | 1.2–7.3 s (first open, old copy) | Database copies exist. These waits happen only when the stored copy is too old. |

## 3. Saves still sent straight to Google (out of scope tonight: writes stay as they are)

| What | Waits (48 h) | Median |
|---|---|---|
| `mgmtAgreeSave` (agreement on file) | 44 | 9.0 s |
| `mgmtEnrolPaid` / `mgmtRenewPaid` (payments, with the Drive receipt) | 23 · 2 | 13–23 s |
| `mgmtRemindLog` / `tRemindLog` (reminder sent) | 21 · 6 | 8–9 s |
| `mgmtLeaveInformed`, `mgmtReportReturn`*, `mgmtTagClass`, `decideLate` | 10 · 4 · 1 · 1 | 8–21 s |

\* `mgmtReportReturn` already shows "Returned" at once through `coe-rq`.

These could go through the database queue as tapping "I'm in" does. That needs one line per save in Google's queue list, as with SB_REPLAY.

## 4. Google sheet tabs the app needs that are not copied into the database

All tabs the app's database code reads are copied, including ACTIVE, DATABASE, S-MONTHLY, T-TIMEIN, TR-DATA, PR-DATA, S-NOTES, S-AGREE, PAYROLL and the DAILY tabs. The data that is **not** copied:

- **COURSEWARE** (book covers): only read when management picks a book cover (`mgmtBookCovers`). It is a set of files, not needed in the database.
- **Google Script Properties `vf:*`** (video review decisions): needed to move the video checks.
- **Google Drive** (videos found in a student's folder, folder links, PDFs, signed copies): files that stay in Drive. The app keeps the links.
- **APP LOG** is copied, but only every ~1.5 h. A faster copy is needed before the "anything changed?" check can move.
