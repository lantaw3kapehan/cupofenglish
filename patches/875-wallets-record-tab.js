// 875: Wallets (audit #16 + Misty 25 Oct: "a clearly visible Wallets tab in Finance"; "Sales & costs: results and checks before wallets").
// Checked in code: Transfer / Remit / Check balance / Other in-out only RECORD an entry (coe-wallet 'add' inserts one coe_wallet row;
// 'fee' sets a missing charge once; 'undo' marks void_at). Nothing calls a payment or bank API — no money is moved by the app.
// · Finance tab bar: new "Wallets" tab (President only, same rule as the card: isPres()). It shows the SAME wallet card — the same
//   card()/tile() drawing, wlForm/wlHist/wlFee/wlUndo handlers, balances, records and coe-wallet calls — expanded. The one card
//   moves between Sales & costs and Wallets (only one #wlCard on the page), so nothing is duplicated.
// · Sales & costs: the wallet card now comes AFTER the financial results and checks (after .x73) and is folded by default
//   ("Wallets 钱包 · ¥total · Show"); the open/closed choice is kept while the page is open. Everything inside is unchanged.
// · Labels: Transfer → Record a transfer · Remit → Record a remittance · Check balance → Record a balance check ·
//   Other in / out → Record other in / out · History → Wallet activity. Each form starts with "This only records the entry …
//   it does not send or move any money". Save buttons: "Save transfer record", "Save remittance record", "Save balance check", "Save record".
// · Default charges explained: remittance charge starts at ¥50 (the usual charge, changeable, taken on top of the amount);
//   transfer charge can be left empty and added later once.
// · Preview: "Balance after this entry · Alipay: ¥…" with a line saying how it is worked out and that nothing is saved until Save.
// · Negative preview balances read −¥50.00 instead of ¥-50.00.
// Calculations, fees, rounding, undo rules, permissions: unchanged.
// (generated: each pair is [exact text in app.html, replacement]; JSON strings)
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + "<script>\n/* 875 · Finance › Wallets tab: the same wallet card as Sales & costs, expanded (President only) */\n(function(){\n  if(window.__875) return; window.__875 = 1;\n  try{ if(VIEWS.indexOf('wallets') < 0) VIEWS.push('wallets'); if(!$('v-wallets')){ const d = document.createElement('div'); d.id = 'v-wallets'; d.className = 'hide'; const ref = $('v-money'); ref.parentNode.insertBefore(d, ref.nextSibling); } }catch(e){ console.warn('875', e); }\n  let tries = 0;\n  function show(){ const v = $('v-wallets'); if(!v) return;\n    if(!v.querySelector('.wl870a')) v.insertAdjacentHTML('beforeend', '<div class=\"lead\"><h1>Wallets</h1><div class=\"mute small\">Alipay 支付宝 · WeChat 微信 · CCB 中国建设银行 · balances recorded in this app · President only</div></div><div id=\"wl875n\"></div><div class=\"wl870a\"></div>');\n    const n = $('wl875n'), ok = typeof isPres === 'function' && isPres();\n    if(n) n.innerHTML = ok ? '' : '<div class=\"empty\">' + (typeof D !== 'undefined' && D && D.mgr ? 'Wallets are for the President only.' : 'Loading…') + '</div>';\n    if(ok && typeof window.wlPaint870 === 'function') window.wlPaint870(false);\n    if(!ok && !(typeof D !== 'undefined' && D && D.mgr) && tries++ < 30) setTimeout(() => { if(VIEW === 'wallets') show(); }, 1000); }\n  window.wlView875 = show;\n  const _go = window.go; window.go = function(v){ const r = _go.apply(this, arguments); try{ if(v === 'wallets'){ tries = 0; show(); } else if(v === 'money' && typeof window.wlPaint870 === 'function') setTimeout(() => window.wlPaint870(false), 0); }catch(e){ console.warn('875', e); } return r; };\n  try{ if(typeof VIEW !== 'undefined' && VIEW === 'wallets') show(); }catch(e){}\n})();\n</script>\n" + s.slice(i); fs.writeFileSync(file, s);
require('../tools/lib.js')(file, [
  ["function card(){\n  if(!ST) return `<section id=\"wlCard\" class=\"wl\"><div class=\"wl-top\"><h2>Wallets 钱包</h2><span class=\"mute small\">President only</span></div><div class=\"wl-g\"><div class=\"wl-t sk\"></div><div class=\"wl-t sk\"></div><div class=\"wl-t sk\"></div></div></section>`;",
   "function card(full){\n  if(!ST) return `<section id=\"wlCard\" class=\"wl\"><div class=\"wl-top\"><h2>Wallets 钱包</h2><span class=\"mute small\">President only · loading…</span></div><div class=\"wl-g\">${full ? '<div class=\"wl-t sk\"></div><div class=\"wl-t sk\"></div><div class=\"wl-t sk\"></div>' : ''}</div></section>`;"],
  ["return `<section id=\"wlCard\" class=\"wl\"><div class=\"wl-top\"><h2>Wallets 钱包</h2><span class=\"mute small\">¥${n2(tot)} in total · only you see this</span>\n    <div class=\"wl-act\">",
   "return `<section id=\"wlCard\" class=\"wl\">${full ? '<div class=\"wl870 full\"><div class=\"wl870s\">' : `<details class=\"wl870\"${window.__wl870 ? ' open' : ''} ontoggle=\"window.__wl870 = this.open\"><summary>`}<h2>Wallets 钱包</h2><span class=\"mute small\">¥${n2(tot)} in total · recorded balances · only you see this</span>${full ? '</div>' : '<em>Show</em></summary>'}<div class=\"small mute\" style=\"margin:2px 0 10px;line-height:1.45\">Balances kept in this app: the last balance check + Alipay / WeChat sales in SALES since then ± the entries recorded here. These buttons record what you already did in the Alipay, WeChat or bank app. They do not send or move money.${full ? '' : ' <a class=\"lk\" style=\"cursor:pointer\" onclick=\"go(\\'wallets\\')\">Open the Wallets tab ›</a>'}</div><div class=\"wl-top\">\n    <div class=\"wl-act\">"],
  ["onclick=\"wlForm('transfer')\">Transfer</button><button class=\"btn teal sm\" onclick=\"wlForm('remit')\">Remit</button><button class=\"btn ghost sm\" onclick=\"wlForm('check')\">Check balance</button><button class=\"btn ghost sm\" onclick=\"wlForm('out')\">Other in / out</button><button class=\"btn ghost sm\" onclick=\"wlHist()\">History</button>",
   "onclick=\"wlForm('transfer')\">Record a transfer</button><button class=\"btn teal sm\" onclick=\"wlForm('remit')\">Record a remittance</button><button class=\"btn ghost sm\" onclick=\"wlForm('check')\">Record a balance check</button><button class=\"btn ghost sm\" onclick=\"wlForm('out')\">Record other in / out</button><button class=\"btn ghost sm\" onclick=\"wlHist()\">Wallet activity</button>"],
  ["${last.note ? ' · ' + e(last.note) : ''}</div>` : ''}</section>`; }",
   "${last.note ? ' · ' + e(last.note) : ''}</div>` : ''}${full ? '</div>' : '</details>'}</section>`; }"],
  ["function paint(){\n  const v = document.getElementById('v-money'); if(!v) return;\n  const old = document.getElementById('wlCard');\n  if(!pres()){ if(old) old.remove(); return; }\n  const top = v.querySelector('.mx-top'); if(!top) return;\n  const h = card();",
   "function paint(){\n  const wv = document.getElementById('v-wallets'), inW = !!(wv && typeof VIEW !== 'undefined' && VIEW === 'wallets');\n  const v = document.getElementById('v-money'); if(!v && !inW) return;\n  const old = document.getElementById('wlCard');\n  if(!pres()){ if(old) old.remove(); return; }\n  const top = inW ? wv.querySelector('.wl870a') : (v.querySelector('.x73') || v.querySelector('.mx-top')); if(!top) return;\n  const h = card(inW);"],
  ["window.wlClose = close_;",
   "window.wlClose = close_;\nwindow.wlPaint870 = f => refresh(!!f);\nconst yn = x => (x < 0 ? '−¥' : '¥') + n2(Math.abs(x));   /* 875: negative balances as −¥50.00 (was ¥-50.00) */"],
  ["const T = { transfer: 'Transfer between accounts', remit: 'Record a remittance', check: 'Check balance', out: 'Other money in or out', in: 'Other money in or out' }[k];",
   "const T = { transfer: 'Record a transfer between accounts', remit: 'Record a remittance', check: 'Record a balance check', out: 'Record other money in or out', in: 'Record other money in or out' }[k];"],
  ["const body = `${k === 'out' || k === 'in' ? chips(",
   "const body = `<div class=\"small mute\" style=\"margin:0 0 8px;line-height:1.45\">${k === 'check' ? 'Records what the ' + e(F.wallet) + ' app shows now; the balance here starts again from it. Nothing changes in the wallet itself.' : 'This only records the entry in CupOfEnglish. It does not send or move any money · do it in the Alipay, WeChat or bank app first.'}</div>${k === 'out' || k === 'in' ? chips("],
  ["<div class=\"wl-2\"><div><label>Charge (¥)</label>",
   "<div class=\"wl-2\"><div><label>Charge (¥) · usually ¥50</label>"],
  ["placeholder=\"e.g. 50,000\" value=\"${e(F.wlP || '')}\" oninput=\"wlLive()\"></div></div>` : ''}",
   "placeholder=\"e.g. 50,000\" value=\"${e(F.wlP || '')}\" oninput=\"wlLive()\"></div></div><div class=\"small mute\" style=\"margin-top:4px\">The charge starts at ¥50, the usual remittance charge · change it to what was actually charged. It comes out of ${e(F.wallet)} on top of the amount sent.</div>` : ''}"],
  ["<div id=\"wlAfter\" class=\"wl-af\">${after()}</div>",
   "<div id=\"wlAfter\" class=\"wl-af\">${after()}</div><div class=\"small mute\" style=\"margin-top:4px\">Preview from the records in this app (last balance check + sales since + entries). Nothing is saved until you tap Save.</div>"],
  ["${k === 'remit' ? 'Save remittance' : k === 'check' ? 'Save balance' : k === 'transfer' ? 'Save transfer' : 'Save'}",
   "${k === 'remit' ? 'Save remittance record' : k === 'check' ? 'Save balance check' : k === 'transfer' ? 'Save transfer record' : 'Save record'}"],
  ["msg({ transfer: 'Transfer saved', remit: 'Remittance saved', check: 'Balance saved', out: 'Saved', in: 'Saved' }[F.kind] + ' · ' + F.wallet + ' ¥'",
   "msg({ transfer: 'Transfer recorded', remit: 'Remittance recorded', check: 'Balance check saved', out: 'Recorded', in: 'Recorded' }[F.kind] + ' · ' + F.wallet + ' now ¥'"],
  ["return `${F.wallet} after: <b>¥${n2(x.balance - a)}</b>",
   "return `Balance after this entry · ${F.wallet}: <b>${yn(x.balance - a)}</b>"],
  ["→ <b>¥${n2(y.balance + a - fee2)}</b>",
   "→ <b>${yn(y.balance + a - fee2)}</b>"],
  ["return `${F.wallet} after this: <b>¥${n2(nb)}</b>",
   "return `Balance after this entry · ${F.wallet}: <b>${yn(nb)}</b>"],
  ["return `App figure now: <b>¥",
   "return `In our records now: <b>¥"],
  ["return `App figure now: ¥${n2(x.balance)} · ",
   "return `In our records now: ¥${n2(x.balance)} · "],
  ["modal('Wallet history',",
   "modal('Wallet activity',"],
  ["if(v && v.querySelector('.mx-top') && !document.getElementById('wlCard') && pres()) refresh(false);",
   "if(v && v.querySelector('.mx-top') && !v.querySelector('#wlCard') && !(typeof VIEW !== 'undefined' && VIEW === 'wallets') && pres()) refresh(false);"],
  ["`<style>\n.wl{background:#fff;",
   "`<style>\n.wl870>summary{display:flex;align-items:center;gap:10px;flex-wrap:wrap;cursor:pointer;list-style:none;margin-bottom:4px}.wl870>summary::-webkit-details-marker{display:none}\n.wl870>summary h2,.wl870s h2{margin:0;font-size:17px}.wl870>summary em{margin-left:auto;font-style:normal;font-size:13px;font-weight:700;color:#00737B}\n.wl870[open]>summary em{font-size:0}.wl870[open]>summary em::after{content:'Hide';font-size:13px}.wl870s{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:4px}\n.wl870>summary:focus-visible{outline:2px solid #01b0bf;outline-offset:3px;border-radius:6px}\n.wl{background:#fff;"],
  ["{ nav: 'payroll', label: 'Finance', views: [['finov', 'Overview'], ['payroll', 'Payroll'], ['expenses', 'Transactions'], ['money', 'Sales & costs']] }];",
   "{ nav: 'payroll', label: 'Finance', views: [['finov', 'Overview'], ['payroll', 'Payroll'], ['expenses', 'Transactions'], ['money', 'Sales & costs'], ['wallets', 'Wallets']] }];"],
  ["const has = v => v === 'expenses' || v === 'finov' ||",
   "const has = v => v === 'expenses' || v === 'finov' || (v === 'wallets' && typeof isPres === 'function' && isPres()) ||"]
]);
