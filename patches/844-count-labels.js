// 844: Each count says what it counts (audit #8). Labels, captions and tooltips only: no count, rule or cache changes.
// · Overview › Where students come from: "active" → "active students" + tooltip (codes ticked active in ACTIVE, once each,
//   including students whose lessons ran out).
// · Overview › Packages donut: it counts students (one per code), not package rows → caption "per student · lessons left".
// · Overview › Students per teacher: tooltip (teacher on each student's first ticked ACTIVE row; co-taught = one combined name).
// · Overview top › Classes / On time: tooltips (calendar classes today, cancelled left out / teachers with a class today).
// · Students: "N active" → "N active students" + tooltip (lessons left, and ticked in ACTIVE or on a teacher's class list).
// · Packages: "N packages" → "N package rows" + tooltip (one student can have several rows: renewals, shared packages).
// · Schedule summary: tooltips on classes / cancelled / teachers.
// · "updated HH:MM" after Students and Packages: when this phone last received that list (cached copies show their own time).
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 844 · count labels say what they count, and when the list arrived */
(function(){
  if(window.__844) return; window.__844 = 1;
  const AK = 'coe.asof844';
  const asof = () => { try{ return JSON.parse(localStorage.getItem(AK) || '{}') || {}; }catch(e){ return {}; } };
  const WATCH = { 'coe.m.stu': 'stu', 'coe.m.active': 'active' };
  /* remember when a fresh list was stored on this phone (keep() → store('set', 'coe.m.<k>')) */
  const st0 = window.store;
  if(typeof st0 === 'function') window.store = function(op, k){ const r = st0.apply(this, arguments);
    try{ if(op === 'set' && WATCH[k]){ const o = asof(); o[WATCH[k]] = Date.now(); localStorage.setItem(AK, JSON.stringify(o)); } }catch(e){}
    return r; };
  const hm = t => { const d = new Date(t), now = new Date(); const tm = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    return d.toDateString() === now.toDateString() ? tm : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' ' + tm; };
  const asofTxt = k => { const t = asof()[k]; return t ? 'updated ' + hm(t) : ''; };
  const tip = (el, t) => { if(el && el.title !== t) el.title = t; };

  function home(){ const g = document.querySelector('#v-home .x-grid'); if(!g) return;
    g.querySelectorAll('.x-c').forEach(c => { const h = c.querySelector('.x-h'), b = h && h.querySelector('b'), sp = h && h.querySelector('span'); if(!b) return; const t = b.textContent.trim();
      if(/^Where students come from/.test(t)){ if(sp && sp.textContent === 'active') sp.textContent = 'active students';
        tip(c, 'Students counted once each: every student code with at least one row ticked active in ACTIVE (shared packages: each student once). Includes students whose lessons ran out. The Students screen counts students with lessons left; the Packages screen counts package rows.'); }
      else if(/^Packages$/.test(t)){ if(sp && sp.textContent === 'lessons left') sp.textContent = 'per student · lessons left';
        tip(c, 'Counts students, not package rows: one per student code ticked active in ACTIVE, using the lessons left on that student’s first ticked row (a shared package with no number of its own counts as healthy). The Packages screen lists every package row.'); }
      else if(/^Students per teacher/.test(t)){ if(sp && /^\d+ teachers$/.test(sp.textContent)) sp.textContent = sp.textContent + ' on ACTIVE';
        tip(c, 'The teacher written on each student’s first ticked ACTIVE row. A co-taught package shows as one combined name. The Teachers screen lists the teachers in this month’s pay.'); }
      else if(/^Levels$/.test(t)) tip(c, 'Students on the Students list with a CEFR level (latest progress check, else enrolment or trial level).'); });
    const top = document.querySelectorAll('#v-home .x-st > a');
    top.forEach(a => { const l = ((a.querySelector('span') || {}).textContent || '').trim();
      if(l === 'Classes') tip(a, 'Today’s classes on the calendar: done / all, cancelled classes left out');
      else if(l === 'On time') tip(a, 'Time-ins on time / time-ins due so far (on time + late + missing) · "teaching" = teachers on today’s time-in board'); }); }

  function students(){ const v = document.getElementById('v-astudents'), sub = v && v.querySelector('.lead .mute.small'); if(!sub) return;
    const m = sub.innerHTML.match(/^(\d+) active · packages live from ACTIVE/);
    if(m) sub.innerHTML = sub.innerHTML.replace(m[0], m[1] + ' active students · packages live from ACTIVE');
    tip(sub, 'Active students = student codes in ACTIVE with lessons left (or a shared package), that are ticked active or are on a teacher’s class list. Each student is counted once. Packages counts package rows; Overview counts every ticked student, including those who ran out.');
    const a = asofTxt('stu'); let x = sub.querySelector('.asof844'); if(a){ if(!x){ x = document.createElement('span'); x.className = 'asof844'; sub.appendChild(x); } if(x.textContent !== ' · ' + a) x.textContent = ' · ' + a; } }

  function packages(){ const v = document.getElementById('v-active'), sub = v && v.querySelector('.lead .mute.small'); if(!sub) return;
    const m = sub.innerHTML.match(/^(\d+) packages · (\d+) ticked active/);
    if(m) sub.innerHTML = sub.innerHTML.replace(m[0], m[1] + ' package rows · ' + m[2] + ' ticked active');
    tip(sub, 'One row per package in ACTIVE. A student can have several rows (renewals, more than one teacher, shared packages), so this is more than the number of students.');
    const a = asofTxt('active'); let x = sub.querySelector('.asof844'); if(a){ if(!x){ x = document.createElement('span'); x.className = 'asof844'; sub.appendChild(x); } if(x.textContent !== ' · ' + a) x.textContent = ' · ' + a; } }

  function schedule(){ document.querySelectorAll('#v-schedule .s2-sum > span').forEach(sp => { const l = sp.textContent.replace(/^[\d\s]+/, '').trim();
    if(l === 'classes') tip(sp, 'Classes on the calendar this day, cancelled ones not counted');
    else if(l === 'cancelled') tip(sp, 'Classes marked cancelled on the calendar this day');
    else if(l === 'teachers') tip(sp, 'Teachers with at least one class this day that is not cancelled');
    else if(l === 'live now') tip(sp, 'Classes running right now'); }); }

  const wrap = (fn, f) => { const o = window[fn]; if(typeof o !== 'function') return; window[fn] = function(){ const r = o.apply(this, arguments); try{ f(); setTimeout(f, 0); setTimeout(f, 400); }catch(e){} return r; }; };
  wrap('renderHome', home); wrap('renderAStudents', students); wrap('renderActive', packages); wrap('renderSchedule', schedule);
  try{ home(); students(); packages(); schedule(); }catch(e){}
})();
</script>` + s.slice(i);
fs.writeFileSync(file, s);
lib(file, []);
