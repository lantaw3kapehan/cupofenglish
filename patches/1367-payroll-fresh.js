// 1367 · Finance › Payroll shows PAYROLL changes within a minute (Misty 12:17: Katherine and Rose missing from October).
//   The payroll list now comes from Google's own PAYROLL answer (opened: the saved copy first, then Google's), not the database
//   copy of the PAYROLL tab, which can be up to two hours behind; Google refreshes its answer within a minute (paste PAYROLL28)
//   and whenever PAYROLL is edited.
//   The President gets "Mark paid" on this month's Pending cards: it writes the payment date into PAYROLL for that person and month
//   (Google's markPaidMonth, paste PAYROLL28). Until the paste is in, the button says so instead.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["</script>\n<script>\n/* 1366 · each person sees only their own data on this device",
   "</script>\n<script>\n/* 1367 · Finance › Payroll from Google's own PAYROLL answer (fresh within a minute) + Mark paid on this month's cards (President) */\n(function(){\n" +
   "  const base = window.api; if(!base || base.__1367) return;\n" +
   "  const w = function(fn){ if(fn === 'mgmtPayroll' && typeof LIVE !== 'undefined' && LIVE && typeof apiNow === 'function') return apiNow.apply(null, Array.prototype.slice.call(arguments));\n" +
   "    return base.apply(this, arguments); };\n" +
   "  w.__1367 = 1; window.api = w;\n" +
   "  document.head.insertAdjacentHTML('beforeend', '<style>#pyCur .py-st{display:flex;align-items:center;gap:6px}#pyCur .py-mp{font:600 12px Inter,sans-serif;line-height:18px;padding:2px 8px;border-radius:999px;border:1px solid #00A3AD;background:#fff;color:#00737B;cursor:pointer;white-space:nowrap}#pyCur .py-mp:hover{background:#E6F6F7}#pyCur .py-mp[disabled]{opacity:.5;cursor:default}</style>');\n" +
   "  const ym = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); };\n" +
   "  window.payMarkMonth = async function(ev, btn, name){ ev.stopPropagation(); if(!isPres()) return; const mo = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });\n" +
   "    if(!confirm('Mark ' + tName(name) + ' paid for ' + mo + '? Today goes into PAYROLL › DATE OF PAYMENT.')) return;\n" +
   "    btn.disabled = true; btn.textContent = 'Saving…';\n" +
   "    try{ const r = await apiNow('markPaidMonth', TOKEN, name, ym(), true); if(r && r.ok === false) throw r; toast('✓ ' + ((r && r.note) || tName(name) + ' marked paid'));\n" +
   "      try{ store('del', 'coe.m.payroll'); }catch(e){} PL = null; loadPayLedger(); }\n" +
   "    catch(e){ btn.disabled = false; btn.textContent = 'Mark paid'; const m = String((e && (e.msg || e.message)) || e || '');\n" +
   "      toast(/Unknown action/i.test(m) ? 'Mark paid for this month needs Google\\u2019s PAYROLL28 update (Apps Script paste)' : (m || 'Not saved · try again')); } };\n" +
   "  function marks(){ if(!isPres()) return; document.querySelectorAll('#pyCur .py-row').forEach(row => { const st = row.querySelector('.py-st'); if(!st || st.querySelector('.py-mp') || !st.querySelector('.wait')) return;\n" +
   "      const m = String(row.getAttribute('onclick') || '').match(/payslipNow\\('(.+)'\\)/); if(!m) return; const nm = m[1].replace(/&#39;/g, \"'\").replace(/&amp;/g, '&');\n" +
   "      const b = document.createElement('button'); b.type = 'button'; b.className = 'py-mp'; b.textContent = 'Mark paid'; b.title = 'Mark ' + nm + ' paid for this month';\n" +
   "      b.onclick = ev => payMarkMonth(ev, b, nm); st.appendChild(b); }); }\n" +
   "  const r0 = window.renderPayroll; if(typeof r0 === 'function') window.renderPayroll = renderPayroll = function(){ const r = r0.apply(this, arguments); try{ marks(); setTimeout(marks, 0); }catch(e){} return r; };\n" +
   "})();\n</script>\n<script>\n/* 1366 · each person sees only their own data on this device"],
]);
