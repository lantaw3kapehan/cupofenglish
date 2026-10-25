// 804: (Misty) trial report for adults: "YES DO IT" (IELTS instead of KET) and "the skill breakdown … I think this is generic? or not tailored to his performance?"
// · Adults (Learner type Adult …): the level box shows "IELTS ≈ 约等于雅思 · IELTS 3.5–4.5" (the same bands as the rest of the app)
//   instead of Cambridge KET. Children and teens keep Cambridge (Starters, Movers, Flyers, KET…).
// · Skill breakdown now follows each rating. A skill rated clearly below the learner's other skills shows the can-do line of the level
//   below; clearly above, the level above, each with its level tag (e.g. "A1"). The column is "What the teacher saw · 试听课表现".
//   Will: Listening comprehension (1 of 4) now reads the A1 line "understands simple questions … in slow speech", which matches the teacher's notes.
// · The trial card always uses the report made in the app (instant, always the current wording and learner type);
//   Google's copy stays in Drive ("Open in Drive").
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["<span style=\"margin-top:8px\">CAMBRIDGE ENGLISH ≈ 对应剑桥英语</span><b>${e(p[13] || '—')}</b>",
   "${/^Adult/i.test(String(F.group || '')) ? '<span style=\"margin-top:8px\">IELTS ≈ 约等于雅思</span><b>IELTS ' + e(({ 'Pre-A1': 'below 3.5 · 低于3.5', A1: 'below 3.5 · 低于3.5', A2: '3.5–4.5', B1: '4.5–5.5', B2: '5.5–6.5', C1: '6.5–7.5', C2: '7.5–9.0' })[lv] || '—') + '</b>' : '<span style=\"margin-top:8px\">CAMBRIDGE ENGLISH ≈ 对应剑桥英语</span><b>' + e(p[13] || '—') + '</b>'}"],
  ["<th>WHAT ${e(lv)} LOOKS LIKE (CEFR) · ${e(lv)}级别能力表现</th>",
   "<th>WHAT THE TEACHER SAW (CEFR) · 试听课表现</th>"],
  ["cd = can(c[0], lv); return",
   "avg = F.total / 9, r0 = F.pts[k], i0 = LV.indexOf(lv), j0 = Math.max(0, Math.min(LV.length - 1, r0 <= avg - 0.75 ? i0 - 1 : r0 >= avg + 0.75 ? i0 + 1 : i0)), rl = LV[j0], cd0 = can(c[0], rl), cd = [(rl !== lv ? rl + ' · ' : '') + cd0[0], (rl !== lv ? rl + ' · ' : '') + cd0[1]]; return"],
  ["else setTimeout(go, 2000);", "else setTimeout(go, 50);"]
]);
const fs = require('fs');
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 804 · the trial card uses the report made in the app */
(function(){
  if(window.__804 || typeof window.api !== 'function') return; window.__804 = 1;
  const base = window.api;
  const w = function(fn){ if(fn === 'mgmtTrialPdf' && typeof D !== 'undefined' && D && D.mgr && window.tlInstant) return Promise.resolve({ ok: false, app: true }); return base.apply(this, arguments); };
  for(const k in base) try{ w[k] = base[k]; }catch(e){}
  window.api = w;
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
