# Fixed monthly pay on pay cards — release 1373 (28 Oct 2026)

**Problem:** Katherine's October card in Finance › Payroll said "on pace ₱6,460". The pace line divides pay so far by the days gone and multiplies by the days in the month. That is right for per-lesson pay, but wrong for someone paid a fixed ₱5,000 a month.

## What changed
- **Who counts as fixed pay:** the database setting `sys:fixedpay` (management only). It is the same list Google's FIXPAY28 paste uses to put the monthly amount into TIME-IN.
- **New edge function `coe-fixedpay`:** `POST {token}`.
  - Management gets the whole list.
  - Anyone else gets only their own entry, or nothing.
  - So no one can see another person's pay.
- **App (patch 1373):**
  - **Finance › Payroll, this month's cards:** a fixed-pay person shows "fixed monthly pay · ₱5,000" instead of "pace ₱…".
  - **The person's own Pay card (teacher) or My pay card (staff):** "Fixed monthly pay · ₱5,000 a month · not paid per lesson" instead of "on pace for about ₱…".
  - **If someone leaves the list,** or a different person uses the same open screen, the normal pace line comes back.
- **Nothing else changes.** The amounts still come from PAYROLL. Everyone not in the list keeps their pace line.

## Who it affects
**1 person:** Katherine (₱5,000, Digital Content Creator). `sys:fixedpay` lists only her.
- She has no app account, so today only the management Payroll card shows the change.
- Anyone added to `sys:fixedpay` later is covered on both the Payroll card and their own card.
- Celine is not fixed pay: she is paid a daily rate (₱546/day from TIME-IN), so her pace line stays.

## Checks
- **Preview, management:** Katherine's card changed from "on pace ₱6,460" to "fixed monthly pay · ₱5,000". Julia's "on pace ₱26,630" is unchanged.
- **Preview, personal:**
  - a fixed person's own card shows "Fixed monthly pay ₱5,000";
  - a person not on the list keeps "on pace for about ₱12,710".
- **Server:** `coe-fixedpay` refuses a call without a valid sign-in.
- **Stability:** Payroll, Sales, Today (management) and Pay, Today, Growth (teacher) are stable on laptop and phone.
- **Regress-saves:** all 17 save/refresh checks passed.
- **Release:** CI passed. Main `ddd6093`, COE_V 1373.

## Rollback
- **App:** revert to the branch `rollback-pre-1373` (`3bac77c`).
- **Server:** `coe-fixedpay` can stay deployed; nothing else calls it.
