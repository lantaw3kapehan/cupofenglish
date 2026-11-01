// 1685: (Misty, 1 Nov 10:36 + 10:40) "Why is Yoyo's schedule in December shown and then gone? The last is showing wrong too · a
//   while ago it was showing till Feb." + "Ensure the scheduling count follows the lesson package they bought, like 30 + 3 = 33."
//   Cause: the student page's class list (mgmtStuClasses) reads only 6 weeks ahead from the database and takes later classes from
//   Google's last saved copy. A new student has no saved copy, so the calendar stopped after 6 weeks and "Book the rest" counted
//   too few classes as already booked (Yoyo: 98 classes booked = 49 units, package 33 units; the page showed 13).
//   · Management: the list now also asks the new edge function coe-stucls for every class from today on (the class table is the
//     original since 19 Oct), so the calendar, "last", the booked count, Weekly picture and Book the rest see the whole schedule.
//   · Add class (weekly package, regular classes): before saving, if the classes being added + those already booked go over the
//     student's lessons left (enrolled + free, e.g. 30 + 3 = 33), the app says so and asks before booking.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  window.swMine1676 = ",
   "  /* 1685 · a student's whole future schedule from the class table + a package check before booking */\n" +
   "  try{ const SU1685 = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-stucls', FC1685 = {};\n" +
   "    const full1685 = code => { const k = String(code || '').toUpperCase(), c = FC1685[k]; if(c && Date.now() - c.t < 20000) return c.p;\n" +
   "      const p = fetch(SU1685, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, code: k }) }).then(r => r.json()).then(j => j && j.ok && Array.isArray(j.classes) ? j.classes : null).catch(() => null);\n" +
   "      FC1685[k] = { t: Date.now(), p }; return p; };\n" +
   "    window.full1685 = full1685;\n" +
   "    const merge1685 = (L, F) => { if(!Array.isArray(F)) return L; const A = Array.isArray(L) ? L : [], d = new Date(Date.now() + 8 * 36e5).toISOString().slice(0, 10), t0 = Date.parse(d + 'T00:00:00+08:00');\n" +
   "      const old = {}; A.forEach(x => { if(x && x.id) old[x.id + '|' + x.start] = x; });\n" +
   "      const past = A.filter(x => x && Date.parse(x.start) < t0), fut = F.map(x => { const o = old[x.id + '|' + x.start]; return Object.assign({}, o || {}, x, { makeup: o ? !!o.makeup : false }); });\n" +
   "      return past.concat(fut).sort((a, b) => String(a.start).localeCompare(String(b.start))); };\n" +
   "    const _api1685 = window.api; if(_api1685) window.api = function(fn){ const p = _api1685.apply(this, arguments);\n" +
   "      if(fn !== 'mgmtStuClasses' || typeof D === 'undefined' || !D || !D.mgr) return p; const code = arguments[2];\n" +
   "      return Promise.all([p, full1685(code)]).then(([L, F]) => Array.isArray(L) ? merge1685(L, F) : L); };\n" +
   "    const _sc1685 = window.sendClass; if(_sc1685) window.sendClass = async function(){ try{\n" +
   "      const s = typeof classStu === 'function' ? classStu() : null, rep = $('cR') && $('cR').checked;\n" +
   "      if(s && rep && !window.CFORCE1685 && (typeof CKIND === 'undefined' || !CKIND) && s.left != null && s.left !== '' && !s.shared){\n" +
   "        if(!(CLSM && CLSM[s.code])){ const F = await full1685(s.code); if(F) CLSM[s.code] = F; }\n" +
   "        const R = typeof classRest === 'function' ? classRest() : null, Dt = typeof classDates === 'function' ? classDates() : [], m = +(($('cM') || {}).value) || 50, add = Math.round(Dt.length * (m <= 30 ? 0.5 : 1) * 10) / 10;\n" +
   "        if(R && add > 0 && R.booked + add > R.left + 0.01){ const over = Math.round((R.booked + add - R.left) * 10) / 10, can = Math.max(0, Math.round((R.left - R.booked) * 50 / m));\n" +
   "          const msg = (s.name || s.code) + ' has ' + R.left + ' lesson units left' + (R.booked ? ' and ' + R.booked + ' are already booked' : '') + '.\\n\\nThese ' + Dt.length + ' classes of ' + m + ' min are ' + add + ' units, so the schedule would go ' + over + ' units over the package.\\n\\nThe package allows ' + can + ' more class' + (can === 1 ? '' : 'es') + ' of ' + m + ' min (tip: \"Book the rest\").\\n\\nBook these ' + Dt.length + ' classes anyway?';\n" +
   "          if(!confirm(msg)) return; } }\n" +
   "    }catch(e){ console.warn('1685', e); } return _sc1685.apply(this, arguments); };\n" +
   "  }catch(e){}\n" +
   "  window.swMine1676 = "]
]);
