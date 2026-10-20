// 20 Oct · Teacher card: time-ins as a day-by-hour chart (dots), the full list folded underneath.
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 20 Oct · 448 · Misty: "this part, any better visual way, like instead of words, graphs?"
   Time-ins on the teacher card become a chart: one line per day (newest on top), hours across.
   Each time-in is a dot at the minute it was made: green on time, coral late, grey other; an amber ring = unstable network
   (ping over 300 ms or jitter over 100 ms); a square = the day time-in. Hover a dot for the class, status and speed.
   On the right of each day: how many time-ins and how many late. The full list with device, speed and location stays, folded. */
(function(){
  const css = document.createElement('style');
  css.textContent = \`
.t46 .tv48 .r{display:grid;grid-template-columns:78px minmax(0,1fr) 92px;gap:10px;align-items:center;height:30px}
.t46 .tv48 .r>span{font-size:12.5px;color:#55526E;white-space:nowrap}
.t46 .tv48 .r>span b{color:var(--ink)}
.t46 .tv48 .r>em{font-style:normal;font-size:12px;color:#8A86A0;text-align:right}
.t46 .tv48 .tr{position:relative;height:30px}
.t46 .tv48 .tr:before{content:'';position:absolute;left:0;right:0;top:14px;height:2px;background:var(--soft);border-radius:1px}
.t46 .tv48 .tr i{position:absolute;top:8px;width:14px;height:14px;border-radius:7px;transform:translateX(-50%);box-shadow:0 0 0 2px #fff;cursor:default}
.t46 .tv48 .tr i.d{border-radius:3px}
.t46 .tv48 .tr i.u{box-shadow:0 0 0 2px #fff,0 0 0 4px #E0A030}
.t46 .tv48 .ax{display:grid;grid-template-columns:78px minmax(0,1fr) 92px;gap:10px}
.t46 .tv48 .ax div{position:relative;height:16px}
.t46 .tv48 .ax b{position:absolute;transform:translateX(-50%);font-size:10.5px;font-weight:400;color:#8A86A0}
.t46 .tv48 .lg{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:11.5px;color:#8A86A0;margin-top:8px}
.t46 .tv48 .lg i{display:inline-block;width:10px;height:10px;border-radius:5px;margin-right:5px;vertical-align:-1px}
.t46 details.ta48{margin-top:10px}
.t46 details.ta48>summary{font-size:12.5px;font-weight:700;color:#2F6F77;cursor:pointer}\`;
  document.head.appendChild(css);
  const WD = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'], MN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const bad = t => { const m = String(t.speed || '').match(/(\\d+(?:\\.\\d+)?)\\s*ms\\s*·\\s*jitter\\s*(\\d+(?:\\.\\d+)?)/); return !!(m && (+m[1] > 300 || +m[2] > 100)); };
  const mins = s => { const m = String(s || '').match(/(\\d{1,2}):(\\d{2})/); return m ? +m[1] * 60 + +m[2] : null; };
  function chart(T){ const L = T.slice(0, 40).filter(t => mins(t.time) != null); if(!L.length) return '';
    const by = {}; L.forEach(t => (by[String(t.date).slice(0, 10)] = by[String(t.date).slice(0, 10)] || []).push(t));
    const days = Object.keys(by).sort().reverse().slice(0, 7);
    const all = days.reduce((a, d) => a.concat(by[d]), []), lo = Math.floor(Math.min(...all.map(t => mins(t.time))) / 60) * 60, hi = Math.ceil((Math.max(...all.map(t => mins(t.time))) + 1) / 60) * 60, sp = Math.max(60, hi - lo);
    const X = m => (m - lo) / sp * 100; let ax = ''; for(let h = lo; h <= hi; h += 60) ax += '<b style="left:' + X(h) + '%">' + String(h / 60).padStart(2, '0') + ':00</b>';
    const col = t => t.status === 'On time' ? '#2E9E6F' : /Late|Missing/.test(t.status) ? '#D4705A' : '#B9B6C8';
    return '<div class="cd tv48"><div class="ax"><span></span><div>' + ax + '</div><span></span></div>' +
      days.map(d => { const R = by[d], dt = new Date(d + 'T12:00:00'), late = R.filter(t => /Late|Missing/.test(t.status)).length, un = R.filter(bad).length;
        return '<div class="r"><span><b>' + WD[dt.getDay()] + '</b> ' + dt.getDate() + ' ' + MN[dt.getMonth()] + '</span><div class="tr">' +
          R.map(t => '<i class="' + (t.type === 'Class' ? '' : 'd') + (bad(t) ? ' u' : '') + '" style="left:' + X(mins(t.time)) + '%;background:' + col(t) + '" title="' + esc(t.time + ' · ' + (t.type === 'Class' ? 'Class ' + (t.cls || '') : 'Day time-in') + ' · ' + t.status + (t.speed ? ' · ' + t.speed : '') + (bad(t) ? ' · unstable network' : '')) + '"></i>').join('') +
          '</div><em>' + R.length + ' in' + (late ? ' · <b style="color:#C0563F">' + late + ' late</b>' : '') + (un ? ' · <b style="color:#B07A10">' + un + ' ⚠</b>' : '') + '</em></div>'; }).join('') +
      '<div class="lg"><span><i style="background:#2E9E6F"></i>on time</span><span><i style="background:#D4705A"></i>late</span><span><i style="background:#2E9E6F;border-radius:2px"></i>day time-in</span><span><i style="background:#fff;box-shadow:0 0 0 2px #E0A030"></i>unstable network</span></div></div>'; }
  const _t = window.tchHtml; if(!_t) return;
  window.tchHtml = function(name, p){ let h = _t.apply(this, arguments);
    try{ const T = (p && p.timeIns) || [], a = h.indexOf('<div class="cd ti">'), b = h.indexOf('<div class="sh"><span>Students'); if(a < 0 || b < a || !T.length) return h;
      const v = chart(T); if(!v) return h;
      h = h.slice(0, a) + v + '<details class="ta48"><summary>All ' + Math.min(12, T.length) + ' time-ins · device, speed, location</summary>' + h.slice(a, b) + '</details>' + h.slice(b);
    }catch(e){ console.warn('tv48', e); }
    return h; };
})();
` + "</script>\n\n</body>"]]);
