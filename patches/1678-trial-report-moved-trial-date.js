// 1678: (Misty, 31 Oct 22:19) "Resa's trial class feedback with Haochen is not showing on our management and it's gone on her
//   feedback part · we need to send it to the parent."
//   Haochen's trial was booked for Mon 26 Oct 19:00 and moved by Operations to Sat 31 Oct 19:00. The trial list (TC&SUB) keeps the
//   booked date, so Resa's "Write report" opened for 26 Oct. Her report went into the queue (the app shows a queued report as sent
//   and takes it off her list), and Google refused it: it checks that the teacher had that trial on that day, and on 26 Oct there
//   was none ("Only your own trial classes."). Same cause as Will 24 → 25 Oct (1560), on the teacher side.
//   Now, before a trial form opens or a report is sent, the app checks the teacher's own classes: if she has no class with that
//   student on the logged day but has one 3 days before to 30 days after, the form and the report use the day it was taught.
//   (Resa's report of 31 Oct 22:06 was sent again with 31 Oct by Claude, write 3793.)
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  window.swMine1676 = ",
   "  /* 1678 · a moved trial: the trial form and report use the day it was taught */\n" +
   "  try{ const _api1678 = window.api, ymd1678 = d => { const x = new Date(d); return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); };\n" +
   "    const fix1678 = c => { try{ if(!c || !c.date || typeof D === 'undefined' || !D || D.mgr) return c;\n" +
   "      const code = String(c.code || '').toUpperCase(), stu = String(c.student || '').trim().toLowerCase(), hit = x => (code && String(x.code || '').toUpperCase() === code) || (stu && String(x.student || '').trim().toLowerCase() === stu);\n" +
   "      const L = (D.schedule || []).filter(x => x && !x.cancelled && hit(x)).map(x => ({ day: x.day || (x.start ? ymd1678(x.start) : ''), time: x.start && typeof tm === 'function' ? tm(x.start) : '', tc: /-TC\\b/i.test(String(x.title || '')) || /trial/i.test(String(x.type || '')) })).filter(x => x.day);\n" +
   "      if(!L.length || L.some(x => x.day === c.date)) return c;\n" +
   "      const t0 = Date.parse(c.date + 'T12:00:00'), near = L.filter(x => { const d = (Date.parse(x.day + 'T12:00:00') - t0) / 864e5; return d >= -3 && d <= 30; }).sort((a, b) => (b.tc - a.tc) || Math.abs(Date.parse(a.day) - t0) - Math.abs(Date.parse(b.day) - t0))[0];\n" +
   "      return near ? Object.assign({}, c, { date: near.day, time: near.time || c.time, booked1678: c.date }) : c; }catch(e){ return c; } };\n" +
   "    if(_api1678) window.api = function(fn){ if((fn === 'tTrialSubmit' || fn === 'tTrialForm') && arguments.length > 2){ const a = Array.prototype.slice.call(arguments); a[2] = fix1678(a[2]); return _api1678.apply(this, a); } return _api1678.apply(this, arguments); }; }catch(e){}\n" +
   "  window.swMine1676 = "]
]);
