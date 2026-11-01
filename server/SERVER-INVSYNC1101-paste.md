# SERVER-INVSYNC1101 · a sale / enrolment / renewal saved with a Payment Confirmation takes its lessons + free lessons from it

Pasted by Claude on 1 Nov 2026 (10:28) at the end of **SRCFIX31.gs** and saved. **Not deployed yet:** the deploy was blocked for Claude; Misty deploys (Deploy › Manage deployments › ✏️ › Version: New version › Deploy). Until then the web app runs version 448 without it.

Why: Yoyo ST-2025-083 · Payment Confirmation 1753 = 30 + 3 bonus, but Finance › Add sale had Free lessons empty, so SALES row got 30 + 0.

What it does: when addSale / mgmtEnrolPaid / mgmtRenewPaid is called with an invoice or file named PaymentConfirmation<no>, pkg and free are taken from that confirmation in the Supabase database (coe_invoices: main line qty, BONUS lines). Only issued confirmations of the same student; dry checks and "pick a payment already in SALES" are untouched. Tested in Node with stand-ins.

Undo: delete the block from `// ═════ 1 Nov · INVSYNC1101` to `// ═════ END INVSYNC1101 ═════`, save, deploy.

```javascript
// ═════ 1 Nov · INVSYNC1101 · a sale / enrolment / renewal saved with a Payment Confirmation takes its lessons + free lessons from it ═════
// The confirmation (coe_invoices in the Supabase database) is the record the parent receives: main line qty = lessons, BONUS lines = free.
// When addSale / mgmtEnrolPaid / mgmtRenewPaid is called with an invoice or file named "PaymentConfirmation<no>…", pkg and free are set
// from that confirmation (issued, same student when the call has a code). Everything else is unchanged. UNDO: delete this block, deploy.
function inv1101Get_(f) {
  try {
    const nm = String((f && (f.invoice || (f.file && f.file.name))) || ''), m = nm.match(/PaymentConfirmation\s*_?\s*(\d{4,6})/i); if (!m) return null;
    if (typeof sbReq_ !== 'function' || typeof sbCfg_ !== 'function' || !sbCfg_()) return null;
    const L = sbReq_('get', 'coe_invoices?select=no,code,status,items&no=eq.' + m[1] + '&limit=1') || [], x = L[0];
    if (!x || x.status !== 'issued' || !Array.isArray(x.items)) return null;
    if (f.code && x.code && String(f.code).trim().toUpperCase() !== String(x.code).trim().toUpperCase()) return null;
    const bonus = x.items.filter(function (i) { return i.pcode === 'BONUS'; }).reduce(function (a, i) { return a + (+i.qty || 0); }, 0);
    const main = x.items.filter(function (i) { return i.pcode !== 'BONUS'; }).sort(function (a, b) { return (+b.rate || 0) - (+a.rate || 0); })[0];
    return main ? { no: x.no, pkg: +main.qty || 0, free: bonus } : null;
  } catch (e) { console.log('INVSYNC1101 read ' + e); return null; }
}
['addSale', 'mgmtEnrolPaid', 'mgmtRenewPaid'].forEach(function (fn) {
  const f0 = globalThis[fn]; if (typeof f0 !== 'function' || f0.__inv1101) return;
  const w = function (token, f) {
    try { if (f && !f.dry && !(Number(f.saleRow) > 0)) { const c = inv1101Get_(f);
      if (c && c.pkg > 0 && (+f.pkg !== c.pkg || +(f.free || 0) !== c.free)) { console.log('INVSYNC1101 ' + fn + ' ' + (f.code || f.invoice || '') + ' · form ' + f.pkg + ' + ' + (f.free || 0) + ' → confirmation ' + c.no + ' ' + c.pkg + ' + ' + c.free); f.pkg = c.pkg; f.free = c.free; } } } catch (e) { console.log('INVSYNC1101 ' + fn + ' ' + e); }
    return f0.apply(this, arguments);
  };
  w.__inv1101 = 1; globalThis[fn] = w;
});
// ═════ END INVSYNC1101 ═════
```
