# Database · renewal rule 1540 (28 Oct 2026) · applied live

Migrations, in order. All applied to project rlxkiahqjsabopmuhern.

- **renewal_rule_1540_a1 / a2 / a3**
  - Table `coe_renew_at` records the time of each app renewal.
  - `coe_renew_early_calc(code, at)` finds lessons held before the renewal that the sheet hadn't counted yet: the S-MONTHLY lag, last 48 h only.
  - Trigger `coe_renew_at_trg` on `writes` (`mgmtRenewPaid` done) fills the table. When Google's result already carries `early`, the trigger records 0.
  - Backfill: 5 app renewals. Only Lucy ST-2024-139 has early = 0.5.
  - Backup of every changed definition: `docs 'bak:1540'`.
- **renewal_rule_1540_b** (text: `SQL-renewal-rule-1540-b.sql`)
  - `coe_cls_days.hb` = lessons on a renewal's start day that ended before the renewal; they count as before the package.
  - `coe_pkg_calc`, `coe_pkg_mon` and `coe_lc_mon` count `hb` as before the package. `coe_pkg_calc.carry_eff` = carry − early, but only while the sheet still holds the recorded carry.
  - `coe_pkg_rows()` writes `carry_eff` into the ACTIVE copy.
  - Checked first in a rolled-back transaction against all 318 packages: only Lucy's rows changed. Dezza row: finished 0.5 → 0. Daniela row: carry 3 → 2.5. Available stays 35.5.
- **renewal_rule_1540_c / c2 / c3**
  - `coe_renew_check()` → `docs 'sys:renewcheck'` (management). Cron `coe-renew-check` every 10 minutes.
  - Per renewed package (last 60 days) it checks four things:
    - carried + new + other − used = now;
    - the sheet carry matches the counter;
    - valid until follows the first class after the renewal;
    - no renewal save is waiting.
  - Helper `coe_n1`.

Database test: `TEST-renewals-1540.sql`. It passed 15/15 when run on 28 Oct.

## Rollback (exact old behaviour, no view rewrite needed)

Every new rule is driven by rows in `coe_renew_at`. With the table empty, `hb` = 0 and `early` = 0, so every count equals the pre-1540 count.

```sql
select cron.unschedule('coe-renew-check');
drop trigger if exists coe_renew_at_trg on writes;
create table if not exists coe_renew_at_bak as select * from coe_renew_at;   -- keep the times
delete from coe_renew_at;
```

The original view and function texts are kept in `docs 'bak:1540'` in case a full restore is ever needed. `coe_pkg_calc.carry_eff` can't be removed with `CREATE OR REPLACE`; it would need a drop/recreate.

## 1541 / 1542 (29 Oct)
- **renewal_rule_1541_sync:** `coe_pkg_sync` no longer keeps the sheet's date-based split as a "sheet fix" when the difference is exactly the renewal rule. Lucy's two fixes from 28 Oct were undone. Backup: `docs 'bak:1541'`.
- **renewal_payat_1542 / _check:** the payment time is now the Payment Confirmation's generated time.
  - New columns on `coe_renew_at`: `saved_at`, `at_src`, `conf_no`.
  - New functions: `coe_renew_payat()` and `coe_renew_payat_apply()`.
  - Trigger `coe_invoice_payat_trg` on `coe_invoices`.
  - `coe_renew_check` lists app renewals that had no confirmation.
  - Backfill: Anna 1748, Leo 1749, Luna 1750 and Lucy 1751 now use their confirmation times. Gina (20 Oct) keeps the save time, because she renewed before in-app confirmations existed. No numbers changed.
- **Rollback 1542:** `drop trigger coe_invoice_payat_trg on coe_invoices; update coe_renew_at set at = coalesce(saved_at, at), at_src = 'renewal save', conf_no = null;`
