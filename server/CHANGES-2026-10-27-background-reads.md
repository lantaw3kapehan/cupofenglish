# 27 Oct · Background Google lookups cut (release 1300, COE_V 1317)

**Problem (coe_speed, last 48 h, background = nobody waiting but Google kept busy):** mgmtNight 482 calls (avg 11 s), mgmtHealth 408,
mgmtTrialFus 386, mgmtMyPay 385 (10.7 s), mgmtFixIgnored 370, mgmtUrls 359, schedLists 356 (13.9 s), mgmtPayChecks 326 (9.8 s),
mgmtPayReady 264; teacher tGrowth 355, tPayCheck 265, tPayReady 257. Every app start / reload on a management laptop fired ~8 of
them at once although the screens already showed the database copy.

**Causes found**
1. Google rewrites its database copy only when the answer changes. An unchanged answer kept the old date, so every reload saw the
   copy as "old" and asked Google again (e.g. mgmtHealth copy dated 12:14 while Google was asked at 12:29, 12:34, 12:37, 12:38).
2. Some reads counted as saves (clash check while typing, video flags, password info, package check, PDFs…) and each one marked
   every copy "old" for 2 minutes.
3. Lookups with no database copy (My pay) were asked on every start.

**Fix (app only; numbers, permissions and screens unchanged)**
- When Google's answer equals the copy, the device records "checked at <time>" for that copy (content hash) and treats it as fresh
  from then. For the slow lookups Google never/rarely copies (My pay, pay checks, pay ready, health, nightly check, folder links,
  ignored fixes, trial follow-ups, student/teacher lists; teacher: Growth, pay check, pay ready) the device keeps its own last
  answer and uses it while it is newer than the database copy.
- The reads listed above no longer count as saves; real saves still make copies refresh.
- Background refresh spacing (screens still refresh at once when opened and the copy is older than their limit): student/teacher
  lists 15 min, My pay 30, pay checks / pay ready / trial follow-ups 10, folder links 60, ignored fixes 15 (were 5 min).
- My pay preload on app start reuses the device's last answer if under 30 min old (opening My pay still asks Google).

**Measured (preview, Google answers mocked at 300 ms):** Google calls per management app reload: 8 → 0 (first start still 8).
**Estimated per day (live):** the ~9 home-start lookups go from ~150–240 calls/day each to at most one per refresh interval per
device (≈ 15–40/day each); total Google background calls roughly −70–85 %.

**Stability:** mtoday, schedule, monitor, payroll, teacher today/growth/pay (laptop) all stable (refresh ≤ 0.0023).
**Rollback:** branch rollback-pre-1300 (COE_V 1316).
**Untested:** real Google answers (mocked in preview); per-device effect on phones; watch coe_speed counts tomorrow.
