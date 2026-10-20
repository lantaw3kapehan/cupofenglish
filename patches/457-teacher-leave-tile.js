// 20 Oct · Teacher card: a "Leave · 2026" tile — days and times this year, a dot per month, the next leave.
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 20 Oct · 457 · Misty: "when we click the teacher, above can we also show the leave count and days, for the whole year or monthly".
   A sixth tile on the teacher card (rose): approved leave days this year and how many times, 12 small month columns (Jan–Dec, height = days,
   this month outlined), and the next upcoming or waiting leave. Click it to open Leave filtered to that teacher. From T-LEAVE (the Leave screen's data). */
(function(){
  const css = document.createElement('style');
  css.textContent = \`
.t46 .kp{grid-template-columns:repeat(6,minmax(0,1fr))!important}
.t46 .kp .klv{--c50:#C2557A;--bg50:#FBF0F4;cursor:pointer}
.t46 .kp .klv .mo{display:flex;align-items:flex-end;gap:2px;height:16px;margin:4px 0 2px}
.t46 .kp .klv .mo i{flex:1;background:#EAD3DC;border-radius:2px 2px 0 0;min-height:2px}
.t46 .kp .klv .mo i.on{background:#C2557A}
.t46 .kp .klv .mo i.cur{outline:1.5px solid #C2557A;outline-offset:0}
@media(max-width:1100px){.t46 .kp{grid-template-columns:repeat(3,minmax(0,1fr))!important}}\`;
  document.head.appendChild(css);
  const MN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const same = (a, b) => String(a || '').replace(/^teacher\\s+/i, '').trim().toLowerCase() === String(b || '').replace(/^teacher\\s+/i, '').trim().toLowerCase();
  function tile(name){ const kp = document.querySelector('#sheetBody .t46 .kp'); if(!kp || kp.querySelector('.klv')) return; if(typeof LV === 'undefined' || !LV || !LV.rows) return;
    const y = String(new Date().getFullYear()), t = ymdLocal(new Date()), R = LV.rows.filter(r => same(r.teacher, name));
    const A = R.filter(r => r.status === 'Approved' && String(r.from).slice(0, 4) === y), days = A.reduce((s, r) => s + (+r.days || 0), 0);
    const M = new Array(12).fill(0); A.forEach(r => { const m = +String(r.from).slice(5, 7) - 1; if(m >= 0) M[m] += +r.days || 1; }); const mx = Math.max(1, ...M), cm = new Date().getMonth();
    const nx = R.filter(r => (r.status === 'Approved' || r.status === 'Pending') && r.to >= t).sort((a, b) => String(a.from).localeCompare(String(b.from)))[0];
    const d = document.createElement('div'); d.className = 'k50 klv'; d.title = 'Open Leave for ' + tName(name);
    d.onclick = () => { try{ LV_Q = String(name).replace(/^teacher\\s+/i, ''); closeSheet(); go('leave'); }catch(e){} };
    d.innerHTML = '<small>Leave · ' + y + '</small><b>' + days + ' day' + (days === 1 ? '' : 's') + '</b><div class="mo">' + M.map((v, i) => '<i class="' + (v ? 'on' : '') + (i === cm ? ' cur' : '') + '" style="height:' + (v ? Math.max(4, v / mx * 16) : 2) + 'px" title="' + MN[i] + ': ' + v + ' day' + (v === 1 ? '' : 's') + '"></i>').join('') + '</div>' +
      '<span>' + A.length + ' time' + (A.length === 1 ? '' : 's') + (nx ? ' · next ' + esc(lvDates(nx)) + (nx.status === 'Pending' ? ' (waiting)' : '') : '') + '</span>';
    kp.appendChild(d); const fb = kp.querySelector('.kfb small'); if(fb) fb.textContent = 'Feedback'; }
  const _t = window.tchHtml; if(!_t) return;
  window.tchHtml = function(name, p){ const h = _t.apply(this, arguments);
    setTimeout(() => { try{ if(typeof LV === 'undefined' || !LV){ if(typeof loadLeave === 'function') loadLeave(true).then(() => tile(name)); } else tile(name); }catch(e){ console.warn('lv57', e); } }, 0);
    return h; };
})();
` + "</script>\n\n</body>"]]);
