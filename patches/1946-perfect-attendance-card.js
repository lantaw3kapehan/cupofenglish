// 1946: (Misty, 9 Nov 10:53–10:59) Perfect Attendance (Memo 19-2026) worked out by the database (1944–1945).
//   · Teacher › Pay: "Perfect Attendance · <month>" — qualified (amount added), on track (units so far, tier), or not this month
//     with every reason (late, case, notice of unavailability, teacher cancellation or move, missing notes / video, feedback).
//   · Management › Payroll: the same for every teacher, this month and last month.
//   Data: docs <name>:attend (scope = the teacher) and sys:attend (management), refreshed hourly by coe_attend_run.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["window.paintLates1484 = paintLates;",
   "window.paintLates1484 = paintLates;\n" +
   "  /* 1946: Perfect Attendance card */\n" +
   "  (function(){ const C = {}; const E = s => (typeof esc === 'function' ? esc(s) : String(s == null ? '' : s));\n" +
   "    const P = n => '₱' + (Math.round(+n || 0)).toLocaleString('en-US');\n" +
   "    const mon = ym => new Date(ym + '-15T12:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });\n" +
   "    async function get(key){ const c = C[key]; if(c && Date.now() - c.t < 5 * 6e4) return c.v; let v = null; try{ const d = await sbDoc(key); v = d && d.data ? d.data : null; }catch(e){} C[key] = { t: Date.now(), v }; return v; }\n" +
   "    function one(x, mine){ if(!x) return ''; const u = +x.units || 0, B = x.blockers || [], head = '<b>' + (mine ? '' : E(x.teacher) + ' · ') + E(mon(x.month)) + '</b> <span class=\"small mute\">· ' + u + ' units</span>';\n" +
   "      let st;\n" +
   "      if(x.ok) st = '<div style=\"color:#0E6B5C;margin-top:4px\"><b>✓ Qualified · ' + P(x.amount) + '</b> ' + E(x.tier) + (mine ? ' · added to your pay' : ' · case added') + '</div>';\n" +
   "      else if(B.length) st = '<div style=\"color:#B42318;margin-top:4px\"><b>Not this month</b> · ' + B.length + ' reason' + (B.length === 1 ? '' : 's') + '</div><ul class=\"small\" style=\"margin:4px 0 0 18px;padding:0\">' + B.slice(0, 10).map(b => '<li>' + E(b.t) + '</li>').join('') + (B.length > 10 ? '<li>+' + (B.length - 10) + ' more</li>' : '') + '</ul>';\n" +
   "      else if(x.closed) st = '<div class=\"small\" style=\"margin-top:4px;color:#7A5A00\">Waiting for the monthly feedback check (after the 9th).</div>';\n" +
   "      else st = '<div style=\"color:#0E6B5C;margin-top:4px\"><b>On track</b> · ' + (u >= 50 ? P(x.amount) + ' at ' + E(x.tier) : (50 - u) + ' more units to reach ₱300 (50 units)') + '</div><div class=\"small mute\">Next: 80 units ₱400 · 100 units ₱500</div>';\n" +
   "      return '<div style=\"padding:8px 0;border-top:1px solid #EFEDF4\">' + head + st + '</div>'; }\n" +
   "    const rule = '<div class=\"small mute\" style=\"margin-top:8px\">Memo 19-2026: 100% attendance (no lates), no teacher-initiated cancellations, leave or moves, class notes, videos and monthly feedback on time. Parent or student requests, student no-shows and company changes don\\'t count. Routine internet, power or equipment problems are not force majeure. Checked by the system every hour; the incentive is added on the 1st.</div>';\n" +
   "    async function teacher(){ const v = document.getElementById('v-pay'); if(!v || typeof D === 'undefined' || !D || D.mgr || !D.me) return; const me = String(D.me.name || '').toLowerCase(); if(!me) return;\n" +
   "      const d = await get(me + ':attend'); if(!d) return; const K = Object.keys(d).filter(k => /^\\d{4}-\\d{2}$/.test(k)).sort().reverse(); if(!K.length) return;\n" +
   "      const h = '<div class=\"card\" id=\"pa1946\" style=\"margin-top:12px\"><h2 style=\"margin:0\">Perfect Attendance</h2>' + K.slice(0, 2).map(k => one(d[k], true)).join('') + rule + '</div>';\n" +
   "      const old = document.getElementById('pa1946'); if(old && old.outerHTML === h) return; if(old) old.remove();\n" +
   "      const cards = v.querySelectorAll('.card'); if(cards.length > 1) cards[1].insertAdjacentHTML('afterend', h); else v.insertAdjacentHTML('beforeend', h); }\n" +
   "    async function mgmt(){ const v = document.getElementById('v-payroll'); if(!v || typeof D === 'undefined' || !D || !D.mgr) return;\n" +
   "      const d = await get('sys:attend'); if(!d) return; const K = Object.keys(d).filter(k => /^\\d{4}-\\d{2}$/.test(k)).sort().reverse(); if(!K.length) return;\n" +
   "      const sec = k => { const A = (d[k] || []).slice().sort((a, b) => (b.ok - a.ok) || ((b.onTrack ? 1 : 0) - (a.onTrack ? 1 : 0)) || (b.units - a.units)); const q = A.filter(x => x.ok), t = A.filter(x => !x.ok && x.onTrack);\n" +
   "        return '<details style=\"margin-top:8px\"' + (k === K[0] ? ' open' : '') + '><summary style=\"cursor:pointer\"><b>' + E(mon(k)) + '</b> <span class=\"small mute\">· ' + (q.length ? q.length + ' qualified · ' : '') + (t.length ? t.length + ' on track · ' : '') + (A.length - q.length - t.length) + ' not this month</span></summary>' + A.map(x => one(x, false)).join('') + '</details>'; };\n" +
   "      const h = '<div class=\"card\" id=\"pa1946m\" style=\"margin-top:12px\"><h2 style=\"margin:0\">Perfect Attendance · Memo 19-2026</h2><div class=\"small mute\">Worked out by the system every hour · the incentive case is added on the 1st for every qualified teacher</div>' + K.slice(0, 2).map(sec).join('') + '</div>';\n" +
   "      const old = document.getElementById('pa1946m'); if(old && old.outerHTML.length === h.length) return; if(old) old.remove(); v.insertAdjacentHTML('beforeend', h); }\n" +
   "    const rp = window.renderPay; if(typeof rp === 'function') window.renderPay = function(){ const r = rp.apply(this, arguments); try{ teacher(); }catch(e){} return r; };\n" +
   "    const rr = window.renderPayroll; if(typeof rr === 'function') window.renderPayroll = function(){ const r = rr.apply(this, arguments); try{ mgmt(); }catch(e){} return r; };\n" +
   "    setInterval(() => { try{ if(typeof VIEW !== 'undefined' && VIEW === 'pay') teacher(); if(typeof VIEW !== 'undefined' && VIEW === 'payroll') mgmt(); }catch(e){} }, 15000);\n" +
   "  })();"]
]);
