// 2195 (13 Nov · Misty): China public holidays, big school exam seasons and international holidays on the calendars, English only.
// · Teacher › Schedule: a "China dates" note for the period shown, and a label on each day that falls in one.
// · Management › Schedule: a note under the day when that day falls in one.
// · Leave form: a plain note when the chosen dates fall in one (no advice, teachers decide).
// · Teacher › Today: "Coming up in China" for anything in the next 3 weeks, at the bottom of the screen (nothing above it moves).
// Official holidays: State Council notice of 5 Nov 2026 (2027). Exam seasons are approximate and differ by city.
const lib = require("../tools/lib.js"), file = process.argv[2];
const JS = String.raw`
<style id="css2195">
.cn95{margin:12px 0 4px;background:#fff;border:1px solid #ECEAF3;border-radius:16px;padding:12px 14px;display:flex;flex-direction:column;gap:8px}
.cn95 h3{margin:0;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#6F6B85}
.cn95 .it{display:flex;flex-direction:column;gap:2px;padding:8px 10px;border-radius:12px;font-size:13.5px;color:#4A4566;line-height:1.4}
.cn95 .it b{font-size:14px}
.cn95 .h{background:#FFF3EF}.cn95 .h b{color:#A4402A}
.cn95 .x{background:#F1EFFB}.cn95 .x b{color:#4A3FA8}
.cn95 .i{background:#E8F5F4}.cn95 .i b{color:#00626A}
.cn95 .w{background:#fff;border:1.5px dashed #8A80D6}.cn95 .w b{color:#4A3FA8}
.sv-day .cn95t{display:inline-block;margin-top:4px;font-size:11.5px;font-weight:600;line-height:1.3;border-radius:6px;padding:2px 6px}
.cn95t.h{background:#FFF3EF;color:#A4402A}.cn95t.x{background:#F1EFFB;color:#4A3FA8}.cn95t.i{background:#E8F5F4;color:#00626A}.cn95t.w{background:#fff;color:#4A3FA8;border:1px dashed #8A80D6}
.cn95lv{margin-top:8px;padding:10px 12px;border-radius:12px;background:#FFF3EF;color:#4A4566;font-size:13px;line-height:1.45}
</style>
<script id="x2195">
(function(){
  if(window.__x2195) return; window.__x2195 = 1;
  /* k: h = China public holiday, x = school exam season (approximate), i = international holiday, w = China make-up school and work day */
  const CN = [
    ['2026-12-24', '2026-12-24', 'i', 'Christmas Eve', ''],
    ['2026-12-25', '2026-12-25', 'i', 'Christmas Day', ''],
    ['2026-12-31', '2026-12-31', 'i', "New Year's Eve", ''],
    ['2027-01-01', '2027-01-03', 'h', "New Year's Day holiday", '3 days off in China.'],
    ['2027-01-11', '2027-01-22', 'x', 'School final exams (about)', 'Students often pause classes to study. Dates differ by city.'],
    ['2027-01-31', '2027-01-31', 'w', 'China make-up school and work day', 'Children have school on this Sunday.'],
    ['2027-02-05', '2027-02-13', 'h', 'Spring Festival', '9 days off in China. Many families pause or move classes.'],
    ['2027-02-14', '2027-02-14', 'w', 'China make-up school and work day', 'Children have school on this Sunday.'],
    ['2027-04-03', '2027-04-05', 'h', 'Tomb Sweeping Day holiday', '3 days off in China.'],
    ['2027-04-19', '2027-04-30', 'x', 'School midterm exams (about)', 'Students often pause classes to study. Dates differ by city.'],
    ['2027-05-01', '2027-05-05', 'h', 'Labour Day holiday', '5 days off in China.'],
    ['2027-05-08', '2027-05-08', 'w', 'China make-up school and work day', 'Children have school on this Saturday.'],
    ['2027-06-07', '2027-06-10', 'x', 'University entrance exam (Grade 12)', 'National exam. Grade 12 students stop classes before it.'],
    ['2027-06-09', '2027-06-09', 'h', 'Dragon Boat Festival', '1 day off in China.'],
    ['2027-06-14', '2027-06-20', 'x', 'High school entrance exam (Grade 9, about)', 'Grade 9 students stop classes before it. Dates differ by city.'],
    ['2027-06-28', '2027-07-09', 'x', 'School final exams (about)', 'Students often pause classes to study. Summer break follows.'],
    ['2027-09-15', '2027-09-15', 'h', 'Mid-Autumn Festival', '1 day off in China.'],
    ['2027-09-26', '2027-09-26', 'w', 'China make-up school and work day', 'Children have school on this Sunday.'],
    ['2027-10-01', '2027-10-07', 'h', 'National Day holiday', '7 days off in China. Many families travel.'],
    ['2027-10-09', '2027-10-09', 'w', 'China make-up school and work day', 'Children have school on this Saturday.'],
    ['2027-12-24', '2027-12-24', 'i', 'Christmas Eve', ''],
    ['2027-12-25', '2027-12-25', 'i', 'Christmas Day', ''],
    ['2027-12-31', '2027-12-31', 'i', "New Year's Eve", '']
  ].map(a => ({ a: a[0], b: a[1], k: a[2], n: a[3], t: a[4] }));
  window.CN2195 = CN;
  const E = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const addD = (y, n) => { const d = new Date(y + 'T12:00:00'); d.setDate(d.getDate() + n); return ymd(d); };
  const dl = y => new Date(y + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const span = x => x.a === x.b ? dl(x.a) : (x.a.slice(0, 7) === x.b.slice(0, 7) ? String(+x.a.slice(8)) : dl(x.a)) + ' to ' + dl(x.b);
  const over = (a, b) => CN.filter(x => x.a <= b && x.b >= a);
  const on = y => CN.filter(x => x.a <= y && x.b >= y);
  const item = x => '<div class="it ' + x.k + '"><b>' + E(x.n) + ' · ' + E(span(x)) + '</b>' + (x.t ? '<span>' + E(x.t) + '</span>' : '') + '</div>';
  const box = (title, L) => L.length ? '<section class="cn95"><h3>' + E(title) + '</h3>' + L.map(item).join('') + '</section>' : '';
  const T = () => ymd(new Date());
  window.cn2195For = over;

  function tsched(v){ const t = typeof TS !== 'undefined' && TS; if(!t || !t.from) return;
    const last = addD(t.from, (t.days || 7) - 1), L = over(t.from < T() ? T() : t.from, last);
    const old = v.querySelector('.cn95'); if(old) old.remove();
    const st = v.querySelector('.stats'); if(st && L.length) st.insertAdjacentHTML('afterend', box('China dates in this period', L));
    v.querySelectorAll('.sv-day[data-y]').forEach(d => { if(d.querySelector('.cn95t')) return; const x = on(d.dataset.y)[0]; const s = d.querySelector('.sv-d span');
      if(x && s) s.insertAdjacentHTML('afterend', '<span class="cn95t ' + x.k + '">' + E(x.n) + '</span>'); }); }
  function sched(v){ const s = typeof SC !== 'undefined' && SC; if(!s || !s.date) return; const old = v.querySelector('.cn95'); if(old) old.remove();
    const L = on(s.date), r = document.getElementById('scDay'); const row = r && r.closest('.row'); if(row && L.length) row.insertAdjacentHTML('afterend', box('China dates on this day', L)); }
  function today(v){ if(typeof D === 'undefined' || !D || D.mgr) return; const old = v.querySelector('.cn95'); if(old) old.remove();
    const L = over(T(), addD(T(), 21)); if(L.length) v.insertAdjacentHTML('beforeend', box('Coming up in China', L)); }
  const RUN = { 'v-tsched': tsched, 'v-schedule': sched, 'v-today': today };
  const MO = new MutationObserver(recs => { const seen = new Set(); recs.forEach(r => { let n = r.target; while(n && !(n.id in RUN)) n = n.parentElement; if(n) seen.add(n); });
    MO.disconnect(); try{ seen.forEach(v => { try{ RUN[v.id](v); }catch(e){ console.warn('2195', e); } }); } finally{ watch(); } });
  function watch(){ Object.keys(RUN).forEach(id => { const v = document.getElementById(id); if(v) MO.observe(v, { childList: true }); }); }
  function start(){ if(!document.getElementById('v-today')){ setTimeout(start, 500); return; } watch(); Object.keys(RUN).forEach(id => { const v = document.getElementById(id); if(v && v.childElementCount){ MO.disconnect(); try{ RUN[id](v); }catch(e){} watch(); } }); }
  start();
  /* leave form: a plain note when the dates fall in a China date */
  document.addEventListener('change', ev => { const id = ev.target && ev.target.id; if(id !== 'lvF' && id !== 'lvTo') return;
    const f = (document.getElementById('lvF') || {}).value, t = (document.getElementById('lvTo') || {}).value || f, to = document.getElementById('lvTo'); if(!f || !to) return;
    const L = over(f, t < f ? f : t).filter(x => x.k !== 'w'), row = to.closest('.row') || to.parentElement, old = document.getElementById('cn95lv'); if(old) old.remove();
    if(L.length) row.insertAdjacentHTML('afterend', '<div class="cn95lv" id="cn95lv">These dates fall in ' + L.map(x => '<b>' + E(x.n) + '</b> (' + E(span(x)) + ')').join(' and ') + '.</div>'); }, true);
})();
</script>
`;
lib(file, [
 ['const dayH = (d, y, L) => `<div class="sv-day ${y===today?', 'const dayH = (d, y, L) => `<div data-y="${y}" class="sv-day ${y===today?'],
 ['<script id="x2181">', JS.trim() + '\n<script id="x2181">']
]);
