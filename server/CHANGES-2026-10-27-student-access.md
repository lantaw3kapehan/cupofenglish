# 27 Oct 2026 · Student portal 学员专区 (releases 1350–1352)

**Link for parents:** https://app.cupofenglishatph.com/student/

**Sign-in (Misty's rule):** username = the student's ST code (spaces / lower case accepted), password = the child's English name
(not case-sensitive; any DATABASE row's English name or the ACTIVE package name for that code). Parents may set their own password
(menu ⋯ › 设置新密码 · Set my own password); the English name then stops working until management clears it.

**Protections:** 5 wrong tries per code → 15-minute lock; 30 wrong tries per connection per hour; sessions last 30 days on that phone;
every sign-in logged (management sees last sign-in and count); management can switch a student's access off (signs the family out).

**What parents see (Chinese first, English beside; phone-first; no Google — works in mainland China):**
- Home: next class (Beijing time, teacher first name, book), countdown, lessons left / used / total, valid until, this week's classes,
  current level, renewal reminder when ≤ 4 lessons left (no prices), latest class note.
- Classes: day strip for the next 4 weeks, list of upcoming classes (substitute / trial marked), past classes (last 4 months) with
  attended / absent / cancelled.
- Homework: per class (last 2 months) — where the class ended, homework, the teacher's class note (observation) and next-class plan
  (the same parent-facing lesson-summary fields), with a "Mark homework done" tick (stored in Supabase, student_hw_done).
- Progress: level journey (same one-level rule as coe-cj), attendance rate, monthly reports actually SENT to parents (reviewed Chinese,
  English original folded).
- Never: prices, payments, phone / WeChat / addresses, teacher internal info, other students, class videos (Google Drive is blocked in China).

**Management:** Students › **Parent access** (beside Partner access): search students, access on/off, last sign-in, clear an own
password, **Copy WeChat message** (Chinese + English, with the link, the ST code and the password rule).

**Server:** edge function `coe-student` (verify_jwt off, own token check); tables `student_access`, `student_sessions`,
`student_login_attempts`, `student_hw_done` (RLS on, service_role only; migration `student_access_20261027`).

**Rollback:** branch `rollback-pre-1350` (screens). Server: delete `coe-student` → the page cannot sign in; nothing else depends on it.

**Not done / untested:** real access from mainland China and inside WeChat's browser; teachers do not yet see the parents' "homework
done" ticks in the app (stored only); management panel tested with mock data only.

## 1351 · Show / Hide password (commit f3da826)

- Eye line icon toggle (44 px, aria-pressed) on sign-in and on Set my own password. No emojis anywhere: app line icons + 1101 colours.

## 1352 · Student portal 学员专区 — inclusive for adult students (COE_V 1326, commit c0ff26e)

- Renamed everywhere: **家长专区 Parent portal → 学员专区 · Student portal** (page title, header, sign-in); management button
  **Student access 学员专区**. Neutral wording: 查看课表、作业… / 学员英文名 Student's English name; renewal reminder unchanged (already neutral).
- **Learner type** = the app's existing adult rule (same as prices / partner rates): DATABASE school grade WA / UM / U# / PhD / ADULT,
  or age ≥ 20 and not a G# grade. `coe-student` v2 returns `adult` on sign-in, in `all.student` and per student in `sList`.
  Unknown → young-learner wording. Today 46 of 681 DATABASE rows count as adults.
- **Home greeting:** adults "Simon 您好 / Hello Simon"; young learners "Mia 家长您好 / Hello, Mia's family".
- **Copy WeChat message:** two templates (adult: 您的课表 / your English name; young learner: Mia 家长您好 / Mia's English name).
  The panel rows show "Adult" or "Young learner".
- Rollback: branch `rollback-pre-1352`.

## 1353 · Redesign + accurate lessons + history, payments, notes (commit 573eebd; coe-student v5; coe-mon v2)

**Accuracy — management's own code, not a copy.** `coe-student/mgmt.ts` loads the live app.html, takes the exact Lesson summary
functions (pkgGroup, shGroup, shLeft, lsRows, lsHtml, shHtml) and patch 1196's month step, and runs them on the exact data the ACTIVE
screen gets (`coe_active_screen()` + `coe_pkg_mon_rows()`). Numbers are read from the variables those functions compute; the 保存图片
picture is their own HTML. A change in management's code is picked up within 15 minutes; if the code cannot be read the portal shows 核对中.
Guards (any one → 核对中 instead of a number): a second independent calculation (`pkg.ts`) differs; a package record has `pend`;
sys:pkgcheck shows database ≠ sheet totals for the package; Google's sheet AU (sys:pkglink) ≠ the database's lessons left.
- Full comparison 27 Oct ~15:00 (sys:portalcheck): **201 active students, 200 shown, 0 mismatches between the portal and management**;
  1 shows 核对中: ST-2023-016 (Google sheet 30.5 left, database/management 30) — needs a look in Packages.
- ST-2022-044 matches the reference picture exactly: 71.5 total, 41.5 done (58%), 30 left; Oct 4 · Sep 2 · Aug 7 · Jul 5 · Jun 6 · May 7 ·
  Apr 4.5 · Mar 5.5; substitute 0.5; 21 Mar 2026 – 22 Mar 2027.
- Apple ST-2022-029 (shared with Zane ST-2022-038): 98.5 total, 53 used, **46.5 left**, valid until 30 Apr 2026 (shown with 待确认 since
  it has passed while lessons remain); "与 Zane（ST-2022-038）共用课时包".
- Daily reconciliation: pg_cron `coe-portal-check` 20:10 UTC (04:10 Manila) → coe-student op `check` → docs `sys:portalcheck`
  { students, shown, checking, mismatches[], sheetDiff[], monRows, app hash }.
- **Management bug fixed on the way: coe-mon returned only the first 1000 of 2,102 monthly rows** (API row limit), so Lesson summary month
  lines for packages past the first 1000 fell back to the sheet's months. coe-mon v2 pages through all rows (ordered). Totals were never affected.

**Renewal reminder** only when the numbers pass every check, lessons left ≤ 4, and never from a zero while classes are booked.

**Payments 缴费记录:** issued Payment Confirmations 付款确认单 (coe_invoices — what the family was emailed, incl. partner students, normal price
as on the confirmation) + SALES rows linked from the student's packages (sys:pkglink column-J links → coe_ledger). Direct students: amount as
recorded (¥ RMB column, else ₱). Partner-referred (any package/DATABASE source like "City – Person", or a SALES partnership that is not
CupOfEnglish/IELTS/TOEFL/Adult English/Reading Program): no amount, no invoice name, no partner name — "课时包 30 节 + 赠送 3 · 已开通".
Shared packages show on both siblings (共用). 凭证 opens a confirmation card rendered from data (logo, no., date, student, items, amount,
method, valid until, verify link) with 保存图片. No Drive files (blocked in China).

**课后 Notes:** every class note since joining (S-NOTES + S-HOMEWORK + saves not copied yet), 20 then 加载更多 30 at a time; parent-facing
fields only (class note, ended, next, homework; the skills column is not sent); management Notes cards: 本月记录, 本月作业, 最新页码, pages chart.

**进步 Progress:** CEFR staircase (Pre-A1 → C2, 现在 Now / 目标 Next) with dated milestones from the coe-cj rule, 我的记录 (first class,
trial, lessons recorded in the app since 2026 — S-MONTHLY does not cover earlier years, so the label says so), teachers, attendance, reports.

**Design audit (before → after):** top tabs → bottom bar 首页 课表 课时 课后 进步; English equal weight → Chinese large + small grey English;
long sentences → short labels; tiles → management KPI cards; chips → status tags with icons (已上 / 缺课 / 已取消 / 代课 / 试听); no Inter →
self-hosted Inter (48 KB) + Fredoka One, `font-display: optional`; logo twice inline → once; skeletons sized per tab; CLS 0.00 at 375 and 1440
on all 5 tabs; tap targets ≥ 44 px; role=tab + aria-selected; Esc closes sheets; no horizontal scroll at 375; only host contacted: supabase.co.

**Not done / limits:** the CEFR staircase uses the portal's own component on the coe-cj data (management's cjHtml needs the full
management student record, which the portal does not load) — same levels, not the same drawing code. 保存图片 uses an SVG→PNG render with the
phone's fonts (Rockwell/Arvo fall back to serif). Payments before the app's links (ACTIVE column J) can't be matched to a student and are not shown.
Rollback: `rollback-pre-1353`; server: redeploy coe-student v2 (1352) if needed.

## 1354 · Portals update themselves · full welcome message · CEFR journey from management's code (COE_V 1327, commit d7c214d; coe-student v6)

- **Auto-update (shared `/portal-update.js`, also used by partner/):** the page knows its version (`<meta name="portal-version">`);
  `student/version.txt` is fetched with `cache:'no-store'` on open, every 5 min and whenever the page becomes visible again (WeChat keeps
  pages alive). If it differs, the page reloads to `?v=<new>` at a safe moment (no field focused, no sheet / picture open); otherwise a
  small "有新版本 · 点此更新 Update" bar, reloading on tap or once idle. Never loops (one try per version per tab). Data also refreshes
  quietly every 5 min and on return (repaints only if something changed, keeps the scroll and notes already loaded).
  `?v=` on fonts, manifest and the updater; `<meta http-equiv="Cache-Control" content="no-cache">`; sw.js skips /student/, /partner/ and
  /portal-update.js. Tested: same version → no reload; new version while typing → bar; tap → reload; no loop.
- **Version bump for every portal release:** `tools/portal-bump.sh student <version>` (or `partner`) — writes `<dir>/version.txt`, the
  page's portal-version meta and every `?v=`. Commit those with the release.
- **Add to Home Screen:** student/manifest.webmanifest (scope /student/, 一杯英语 学员专区), apple-touch-icon, title 一杯英语 · 学员专区.
- **CEFR journey = management's card:** coe-student v6 runs app.html's cjHtml + patch 1221 on the same pieces mgmtStudent sends
  (student_parts DATABASE row, TR-DATA, PR-DATA, S-MONTHLY + coe_stu_daily, coe_stu_classes, coe-cj). ST-2022-044 now reads, top to
  bottom: 2026年9月 教材升级 WondersG1 · 2026年3月 续费 · 2025年9月 升级 OD2 44.5 课时 · 2022年8月 入学 TheAlphabet 230.5 课时 · 2022年7月
  试听 — 共 275 课时, the same as management. "已上课时" on 我的记录 uses the same 275.
- **Welcome message (patch 1354):** Student access › Copy WeChat message and a new "复制学员专区消息 Copy portal message" button on each
  student's page give the full text: 【一杯英语 · 学员专区】, parent (“{name}家长您好”) or adult (“{name}您好…您的课表”) by learner type,
  链接/账号/密码 (or “密码：您设置的密码（如忘记请联系我们重置）”), iPhone and Android home-screen steps, 收藏/浮窗 tip, one English line.
Rollback: `rollback-pre-1354`.

## Patch 1355 · CEFR journey: Book up only from the regular course (27 Oct, COE_V 1330, main 9780b1c)
- **Why Shirui ST-2022-044 showed "2026年9月 教材升级 WondersG1":** her regular Mayi classes from Apr to 11 Oct 2026 were titled
  "…-Shirui-WondersG1-Mayi" in the calendar (from 18 Oct they say OD2). DATABASE says "A1, OD2" and coe_stu_daily records OD2 for those
  months, but cjHtml's calendar step took the first class of any book in the 45-day window (20 Sep, WondersG1) as a Book up.
- **New rule (cjHtml, shared by the management card and the portal):** calendar Book up only for the student's CURRENT book (the latest
  regular class taught, else the next booked) that has ≥ 3 regular classes with one teacher; trial / substitute (TC, SC, SUB, 代课) and
  cancelled classes never count. Monthly records: a book needs ≥ 1.5 lessons taught to become a step. DATABASE book changes unchanged.
- **Shirui now:** 2026年3月 续费 · 2025年9月 升级 A1 OD2 44.5 · 2022年8月 入学 TheAlphabet 230.5 · 2022年7月 试听 — Now A1, 共 275 (portal live check).
- **All active students (201, 0 errors, coe-student op cjdiff → docs sys:cjdiff):** 19 changed, all removals of a wrong Book up step:
  Daisy 2021-002 (C1 "B2"), Apple 2022-029 (OD2), Shirui 2022-044 (WondersG1), Nini 2023-065 ("A1"), Annie 2023-086 (ShortVowels),
  Gaby 2023-087 (OD2), Penny 2024-003 (OD2), Candy 2024-034 (OD2), Jared 2024-108 (OD2, 0 lessons), Bill 2024-167 (OD1),
  Cherry 2025-043 (LongVowels), Oscar 2025-063 (OD2, 1 lesson → merged into OD1 8.5), Dario 2025-065 (TheAlphabet), Lewis 2025-067 (WondersGK),
  Jennie 2026-025 (ODF1), Mandy 2026-048 (DKEnglish), Gary 2026-086 ("A2"), Harry 2026-104 ("A1"), Ella 2026-108 (OD2, 0 lessons).
  Gaby, Penny, Candy and Apple had a few weeks of OD2-titled classes in Sept and are on REF again (DATABASE REF). Now level and totals unchanged for all.
- **Data for Ops (not code):** Shirui's ACTIVE package course chip says OD1 (Lesson summary header) and her September monthly report course
  says WONDERS 1; both should be OD2.
Rollback: `rollback-pre-1355`.

## Patch 1355b · journey dates from real classes, monthly feedback, this week's classes, arrows (27 Oct, main 25e85df → b0a8c13, COE_V 1332, portal 1355d)
- **Journey (management card + portal, same cjHtml):** a book / level step is dated by the first regular class on that book (class-note book first,
  matched to the calendar's book names; else the calendar book; no trial / TC / SC / SUB / cancelled class), any teacher, after the main
  teacher's last class on the old book; a real switch needs ≥ 3 classes on the new book and the classes booked ahead (≥ 80 %) on it.
  Exact day shown (2026年10月18日). A month with a switch shares its lessons by the classes before / from that day (half-lesson steps).
  The book before the switch: class notes, else the package's course (Lesson summary) from the package start when that month's level is on record.
  **No more "2025年9月" fallback:** a step dated only by the first month of the app's records shows 日期核对中 · being checked, its lessons stay with the step before.
- **Results (201 active, 0 errors, vs live 1355):** 104 changed; 0 negative lessons; 21 now have real dates, e.g.
  Shirui 044: OD1 from 2026-03-21 (30) → **OD2 from 2026-10-18 (2)**; Gaby 087: OD1 167.5 → **REF from 2026-10-12 (4)**; Apple 029 REF 2026-10-03;
  Penny 003 REF 2026-09-28; Candy 034 OD2 2026-09-15 → REF 2026-10-16; Bill 167 OD1 2026-09-14 → OD2 2026-10-23; Lily 025 OD2 2026-10-18;
  Tony 035 REF 2026-10-09; Cherry 043 2026-09-30; Dario 065 2026-10-11; Lewis 067; Aurora 082 2026-10-14; Cici 110; Pec 020 OD2 2026-10-07;
  Simone 037; Mandy 048 Pathways1 2026-09-30; Freya 069; Kaylee 100 OD2 2026-10-22. 84 steps are now "being checked" (were 2025年9月).
  Full before → after list: docs `sys:cjdiff`. Known edge: Nico ST-2025-127 has two undated steps; 39.5 lessons sit on the first (being checked).
- **Lesson summary header:** coe_active_screen has a new last column `book` (latest regular class taught with that package's teacher);
  lsHtml shows it (else the course). Shirui: OD2. `course` (which books a package counts) is unchanged.
- **Portal:** monthly class feedback = management's card (score ring, teacher / book chips, 听力 口语 阅读 写作 bars /25, 优势表现 · 需要加强的方面 ·
  下一步学习目标, English original), every report the teacher wrote (sys:fb; one the October tracker holds back is hidden), newest open, older
  months below. Labels follow management (report sent in Oct = "2026年9月" classes). Change arrows (management's .dl pill, line arrows):
  score and each skill vs the same teacher's previous report; lessons attended this month vs last month; none on lessons used / left.
  Home: 本周课表 list under the Next class card (today highlighted, 已取消 / 已改期 → new time, 全部 → Classes; 本周课程 tile scrolls to it),
  剩余 N 节 pill in the Next class card (核对中 when not confirmed). Lessons card shows the current book. Data refresh every 60 s (shared
  portal-update.js `dataEvery`), repaint only when the data changed.
- **Delays (worst case = source delay + 60 s refresh):** schedule: classes table — app changes at once, Google Calendar edits ≤ 3 min (poll);
  class notes: database original (log_rows / writes) — at once; lessons left / used: coe_packages database original, ACTIVE rebuilt every 5 min
  (coe-pkg-sync), sheet guard copied every 2 min; journey: DATABASE (database original, at once), classes (≤ 3 min), class notes (at once),
  -DAILY / S-MONTHLY sheet copies ≤ 30–60 min, management code cached 15 min after a release; monthly feedback: sys:fb copy of the sheet every 30 min.
- coe-student v8–v11 (journey notes/package inputs, cjdiff, feedback list, book, week). Rollback: `rollback-pre-1355b`.

## Patch 1355c · monthly report = the picture report parents receive (27 Oct, main 2cffe4c, COE_V 1333, portal 1355e, coe-student v12)
- **Portal monthly report:** same content and month label as management's picture report (patches 1090 / 1095–1098): "10月学习报告 · October report"
  (report key 2026-11 = October classes), score with "▲ 14 points from September · 比9月提高14分", progress over the months (same teacher),
  four skills /25 with arrows, Strengths / Areas / Next steps in 中文 + English, then the 20-skill breakdown (1–5 dots, ▲ / ▼ vs the same
  teacher's previous report), groups collapsible (open for the latest month). Reports the tracker marks Ready or Sent are shown.
- **保存图片 · Save picture** on every month: coe-student op `fbpic` runs management's own picture code (rpPicPrep / rpPicHtml chain, linkedom DOM)
  on the same data (sys:fb + reviewed Chinese fbcn) → identical picture (Una: 1080 × 6.8k, same sections and arrows).
- **Journey:** steps with 日期核对中 are hidden in the portal (management still shows them; list in docs sys:cjdiff); 1355c gives a hidden step's
  lessons to the nearest confirmed step before it (Nico ST-2025-127). Totals and Now unchanged.
- Verified on Una (83, +14 from September, 20 sub-skills matching the picture), Shirui (80, +3 from August), Gaby (July Cy report 88 with ▼).
Rollback: `rollback-pre-1355c`.
