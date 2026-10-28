// 1373 · fixed monthly pay is not projected from units (Katherine's card said "on pace ₱6,460"; she is paid ₱5,000 a month).
//   Everyone in docs 'sys:fixedpay' (now: Katherine ₱5,000) — the list comes from the edge function coe-fixedpay:
//   management gets the whole list, anyone else only their own entry (never another person's pay).
//   · Management › Finance › Payroll (this month's cards): "fixed monthly pay · ₱5,000" instead of "pace ₱…".
//   · The person's own Pay / My pay card: "Fixed monthly pay · ₱5,000 a month · not paid per lesson" instead of "on pace for about ₱…".
//   Nobody else's card changes; amounts themselves are unchanged (they come from PAYROLL as before).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["</script>\n<script>\n/* 1367 · Finance › Payroll from Google's own PAYROLL answer",
   "</script>\n<script>\n/* 1373 · fixed monthly pay (sys:fixedpay via coe-fixedpay): no pace projected from units on the Payroll card or the person's own Pay card */\n(function(){\n" +
   "  const URL = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-fixedpay';\n" +
   "  let FX = null, at = 0, busy = 0;\n" +
   "  const who = () => (typeof D !== 'undefined' && D && D.me && D.me.name) ? String(D.me.name).trim().toLowerCase() + (D.mgr ? '|m' : '|t') : '';\n" +
   "  function load(){ if(busy || typeof TOKEN === 'undefined' || !TOKEN || (typeof LIVE !== 'undefined' && !LIVE)) return; const w = who(); if(!w || (FX && FX.who === w && Date.now() - at < 10 * 6e4)) return; busy = 1;\n" +
   "    fetch(URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN }) }).then(x => x.json())\n" +
   "      .then(r => { if(r && r.ok && who() === w){ FX = { list: Array.isArray(r.list) ? r.list : null, me: r.me || null, who: w }; at = Date.now(); apply(); } }).catch(() => {}).finally(() => { busy = 0; }); }\n" +
   "  const fixedOf = name => { if(!FX || FX.who !== who()) return null; const n = String(name || '').trim().toLowerCase().replace(/^teacher\\s+/, '');\n" +
   "    if(FX.list) return FX.list.find(x => String(x.name).toLowerCase() === n) || null; return FX.me && String(FX.me.name).toLowerCase() === n ? FX.me : null; };\n" +
   "  function cards(){ document.querySelectorAll('#pyCur .py-row').forEach(r => { const m = String(r.getAttribute('onclick') || '').match(/payslipNow\\('(.+)'\\)/); if(!m) return;\n" +
   "      const f = fixedOf(m[1].replace(/&#39;/g, \"'\").replace(/&amp;/g, '&')), sm = r.querySelector('.py-n small'); if(!sm) return;\n" +
   "      if(!f){ if(sm.dataset.fx1373){ delete sm.dataset.fx1373; sm.className = ''; sm.textContent = 'so far this month'; } return; } const t = 'fixed monthly pay · ' + peso(f.monthly);\n" +
   "      if(sm.dataset.fx1373 !== t){ sm.dataset.fx1373 = t; sm.className = 'c60 r65 fx1373'; sm.textContent = t; sm.title = 'Paid a fixed amount each month, not per lesson'; } }); }\n" +
   "  function own(){ if(typeof D === 'undefined' || !D || !D.me) return; const f = fixedOf(D.me.name);\n" +
   "    if(!f){ document.querySelectorAll('#v-pay .pc70 .t[data-fx1373], #v-mypay .pc70 .t[data-fx1373]').forEach(t => { const p = t.closest('.pc70'); if(p) p.remove(); }); return; }\n" +
   "    ['v-pay', 'v-mypay'].forEach(id => { const v = document.getElementById(id); if(!v) return; v.querySelectorAll('.pc70 .t').forEach(t => {\n" +
   "      const html = '<span>Fixed monthly pay</span><span><b>' + esc(peso(f.monthly)) + '</b> a month · not paid per lesson</span>'; if(t.dataset.fx1373 !== html){ t.dataset.fx1373 = html; t.innerHTML = html; } }); }); }\n" +
   "  function apply(){ try{ cards(); own(); }catch(e){} }\n" +
   "  let q = 0; new MutationObserver(() => { if(q || !FX) return; q = requestAnimationFrame(() => { q = 0; apply(); }); }).observe(document.body, { childList: true, subtree: true });\n" +
   "  ['renderPayroll', 'renderPay', 'renderMyPay'].forEach(fn => { const o = window[fn]; if(typeof o !== 'function') return; window[fn] = function(){ const r = o.apply(this, arguments); try{ load(); apply(); }catch(e){} return r; }; });\n" +
   "  window.__fx1373 = { set: v => { FX = Object.assign({ who: who() }, v); at = Date.now(); apply(); } };   /* preview test hook */\n" +
   "})();\n</script>\n<script>\n/* 1367 · Finance › Payroll from Google's own PAYROLL answer"],
]);
