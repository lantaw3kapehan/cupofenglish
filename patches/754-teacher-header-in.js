// 754: (Misty) teachers get the same header button as management — always in sight, one tap:
//  · before time-in: "Time in · 18:30 class" (pulses from 40 min before the first class; red "Time in · late" once it has started)
//  · after time-in: when a class's "I'm in" is open and not done yet → "I'm in · 19:00 Mia" (pulses; late once the class started)
//  · otherwise a quiet "In 17:52" pill. Nothing shows on a day with no classes.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("    const DD = typeof D !== 'undefined' ? D : null, S = DD && DD.mgr && DD.shift, ti = DD && DD.timeIn;\n    if(!S || (S.rest && !ti) || (ti && ti.out)){ b.className = ''; return; }",
    "    const DD = typeof D !== 'undefined' ? D : null, S = DD && DD.mgr && DD.shift, ti = DD && DD.timeIn;\n    if(DD && !DD.mgr){ tPaint(b, DD); return; }   /* 754: teachers */\n    if(!S || (S.rest && !ti) || (ti && ti.out)){ b.className = ''; return; }");
rep("  window.tinNag = paint; setInterval(paint, 5000); setTimeout(paint, 800);",
    `  /* 754 · teachers: Time in for the first class, then "I'm in" for each class as it opens */
  function tPaint(b, DD){ const now = Date.now(), hm = d => new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    const L = (DD.schedule || []).filter(x => x.day === DD.today && !x.cancelled).sort((a, c) => String(a.start).localeCompare(String(c.start)));
    if(!L.length){ b.className = ''; return; }
    const first = L[0], t0 = +new Date(first.start), ti = DD.timeIn, nm = c => String(c.student || c.title || '').split(/\\s+/)[0];
    if(!ti){ const late = now > t0, open = now >= t0 - 40 * 6e4;
      b.className = open ? 'go' : 'on'; if(late) b.style.background = '#B4442F'; else b.style.background = '';
      b.innerHTML = IC + (late ? 'Time in · late' : open ? 'Time in · ' + hm(first.start) + ' class' : 'Time in opens ' + hm(t0 - 40 * 6e4));
      b.title = 'First class ' + hm(first.start) + (first.student ? ' · ' + first.student : ''); b.onclick = () => timeInSheet(); return; }
    b.style.background = '';
    const CI = DD.classIns || {}, due = L.find(c => { if(c === first || CI[c.id]) return false; const st = +new Date(c.start), en = +new Date(c.end);
      const cont = L.find(x => x !== c && x.code && x.code === c.code && +new Date(x.end) === st); if(cont) return false;
      const prev = L.filter(x => x !== c && +new Date(x.end) <= st).sort((p, q) => +new Date(q.end) - +new Date(p.end))[0]; let op = st - 5 * 6e4; if(prev && +new Date(prev.end) > op) op = +new Date(prev.end);
      return now >= op && now <= en; });
    if(due){ const late = now > +new Date(due.start); b.className = 'go'; if(late) b.style.background = '#B4442F';
      b.innerHTML = IC + "I'm in" + (late ? ' · late' : '') + ' · ' + hm(due.start) + (nm(due) ? ' ' + nm(due) : ''); b.title = 'Tap to check in for this class'; b.onclick = () => classIn(due.id); return; }
    b.className = 'on'; b.innerHTML = IC + 'In ' + (ti.time || ''); b.title = 'Timed in ' + (ti.time || '') + (ti.status ? ' · ' + ti.status : ''); b.onclick = () => { try{ go('today'); }catch(e){} }; }
  window.tinNag = paint; setInterval(paint, 5000); setTimeout(paint, 800);`);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
