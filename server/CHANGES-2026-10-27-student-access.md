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
