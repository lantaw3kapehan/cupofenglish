// 14 Oct · Teacher Pay screen (Misty, Kat): after September was paid, the screen still led with "September 2026 pay · please
// check" (chip "Please check", full table, "✓ Paid") and "September 2026 pay · Ready ✓". Once a month is paid, the check card
// becomes one line "✓ September 2026 pay · ₱16,830 · Paid" and the "ready to be released" card is hidden, so October comes first.
require('../tools/lib.js')(process.argv[2], [
["function payChkHtml(){ const p = PCK; if(!p || !p.me) return ''; const x = p.me, c = p.check || {}, st = pckState(p);",
 "function payPaid(mon){ const k = s => { const t = String(s || '').trim(), m = t.match(/([A-Za-z]{3})[a-z]*\\.?\\s+(\\d{4})/); return m ? m[1].toLowerCase() + m[2] : t.toLowerCase(); }, key = k(mon); if(!key) return false;\n" +
 "  return !!(PCK && PCK.me && PCK.me.paid && k(PCK.month) === key) || ((D && D.pay) || []).some(x => k(x.month) === key && /paid/i.test(String(x.status || ''))); }   /* 14 Oct */\n" +
 "function payChkHtml(){ const p = PCK; if(!p || !p.me) return ''; const x = p.me, c = p.check || {}, st = pckState(p);\n" +
 "if(x.paid) return '<div class=\"card\" style=\"margin-top:14px;padding:12px 16px\"><div class=\"row\" style=\"gap:10px;align-items:center\"><b class=\"grow\">✓ ' + esc(p.month) + ' pay · <span class=\"num\">' + peso(x.net) + '</span></b><span class=\"chip teal\">Paid</span></div></div>';   /* 14 Oct: paid → one line */"],
["function myReadyHtml(){ if(!MYR || !MYR.me) return '';",
 "function myReadyHtml(){ if(!MYR || !MYR.me || payPaid(MYR.month)) return '';   /* 14 Oct: nothing left to release */"],
]);
