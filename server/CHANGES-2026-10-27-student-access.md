# 27 Oct 2026 · Parent / student access (release 1350, COE_V 1324)

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
