// 2175 (13 Nov · Misty 18:53 "ok"): the remittance was recorded from Alipay twice (4 Nov, 13 Nov) though the money left from CCB after a
// transfer. Record a remittance now starts on CCB, and any money-out entry that would take a wallet below zero asks first.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["  F = { kind, wallet: 'Alipay' }; draw();", "  F = { kind, wallet: kind === 'remit' ? 'CCB' : 'Alipay' }; draw();   /* 2175 */"],
  ["  if(F.kind === 'check' && (F.wlA == null || String(F.wlA).trim() === '')) return msg('Type the balance the app shows.');\n  b.disabled = true; b.textContent = 'Saving…';",
   "  if(F.kind === 'check' && (F.wlA == null || String(F.wlA).trim() === '')) return msg('Type the balance the app shows.');\n  if(!F.edit && F.kind !== 'check' && F.kind !== 'in'){ try{ const fee0 = F.kind === 'remit' ? num(F.wlFee != null ? F.wlFee : 50) : F.kind === 'transfer' ? num(F.wlFee) : 0, nb0 = (+W(F.wallet).balance || 0) - a - fee0;   /* 2175 */\n    if(nb0 < -0.005 && !confirm(F.wallet + ' would go below zero (¥' + n2(nb0) + ').\\n\\nIs this the right wallet? A remittance usually leaves from CCB after a transfer.\\n\\nOK = save anyway · Cancel = go back and change it')) return; }catch(x){} }\n  b.disabled = true; b.textContent = 'Saving…';"],
]);
