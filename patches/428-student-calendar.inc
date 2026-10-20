/* 20 Oct · 428 · Student calendar (Misty: "Coming up … like calendar, so it's not easy to confuse and make mistakes when we are changing or adding").
   · The student page's Schedule shows this month and next as calendars: every class is a small time chip on its day,
     in the book colour (done = faded, cancelled = coral struck through, make-up = teal ring, next class = dark).
   · ‹ › moves month by month; "Today" comes back. Each month says how many classes it has, and the last booked class is flagged.
   · Clicking a chip opens that class (change time, cancel, …) as before. The old list stays, folded, as "List view". */
(function(){
  const css = document.createElement('style');
  css.textContent = `
.cal28{margin-top:12px}
.cal28 .ch8{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.cal28 .ch8 b{font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#2F6F77}
.cal28 .ch8 .sp{flex:1}
.cal28 .ch8 button{border:1px solid var(--line);background:#fff;border-radius:999px;height:30px;min-width:30px;padding:0 10px;font:inherit;font-size:13px;color:var(--ink);cursor:pointer}
.cal28 .ch8 button:hover{background:#F2FAFA}
.cal28 .ms{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px}
.cal28 .m{border:1px solid var(--line);border-radius:14px;padding:10px 10px 8px;background:#fff}
.cal28 .mt{display:flex;justify-content:space-between;align-items:baseline;margin:0 2px 6px}
.cal28 .mt b{font-family:var(--brand);font-weight:400;font-size:16px;color:var(--ink)}
.cal28 .mt span{font-size:11.5px;color:#8A86A0}
.cal28 .g{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:3px}
.cal28 .wd{font-size:10.5px;color:#8A86A0;text-align:center;padding-bottom:2px}
.cal28 .d{min-height:52px;border-radius:8px;background:#FAFAFC;padding:3px 3px 4px;display:flex;flex-direction:column;gap:2px;min-width:0}
.cal28 .d.o{background:transparent}
.cal28 .d.we{background:#F6F5FA}
.cal28 .d .n{font-size:10.5px;color:#8A86A0;line-height:1.2;padding-left:2px}
.cal28 .d.td{box-shadow:inset 0 0 0 1.5px #00A3AD;background:#F2FAFA}
.cal28 .d.td .n{color:#00808A;font-weight:700}
.cal28 .d.ps .n{opacity:.55}
.cal28 .k{display:block;font-size:11px;font-weight:700;line-height:1;padding:4px 3px;border-radius:5px;text-align:center;color:#fff;background:var(--c);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:default;border:0;font-family:inherit}
.cal28.mg .k{cursor:pointer}
.cal28 .k:hover{filter:brightness(.92)}
.cal28 .k.dn{opacity:.4}
.cal28 .k.cx{background:#fff!important;color:#C0563F;box-shadow:inset 0 0 0 1px #F0C9BF;text-decoration:line-through}
.cal28 .k.mk{box-shadow:0 0 0 2px #fff,0 0 0 3.5px #00A3AD}
.cal28 .k.nx{background:#2B2253!important;opacity:1}
.cal28 .d.lsd{box-shadow:inset 0 -3px 0 #E0A030}
.cal28 .d.lsd:after{content:'last';font-size:9px;color:#B07A10;font-weight:700;text-align:center;margin-top:auto}
.cal28 .lg{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:11.5px;color:#8A86A0;margin-top:8px}
.cal28 .lg span{display:inline-flex;align-items:center;gap:5px}
.cal28 .lg i{display:inline-block;width:14px;height:10px;border-radius:3px}
.cal28 .ft{font-size:12.5px;color:#55526E;margin-top:8px}
.cal28 .ft b{color:var(--ink)}
details.lv28{margin-top:10px}
details.lv28>summary{font-size:12.5px;color:#2F6F77;font-weight:700;cursor:pointer}
@media(max-width:600px){.cal28 .d{min-height:40px}.cal28 .k{font-size:9.5px;padding:3px 1px}}`;
  document.head.appendChild(css);
  const MN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const hm = d => String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  let OFF = 0, LL = null;
  function month(y, m, by, now, ix){ const first = new Date(y, m, 1), days = new Date(y, m + 1, 0).getDate(), lead = (first.getDay() + 6) % 7, today = ymd(new Date());
    let n = 0, cx = 0; let cells = '';
    for(let i = 0; i < lead; i++) cells += '<div class="d o"></div>';
    for(let d = 1; d <= days; d++){ const dt = new Date(y, m, d), k = ymd(dt), E = by[k] || [], wd = dt.getDay();
      E.forEach(e => e.cancelled ? cx++ : n++);
      cells += '<div class="d' + (k === today ? ' td' : '') + (k < today ? ' ps' : '') + (wd === 0 || wd === 6 ? ' we' : '') + (E.some(e => LL.indexOf(e) === ix.last) ? ' lsd' : '') + '"><span class="n">' + d + '</span>' +
        E.map(e => { const s = new Date(e.start), i = LL.indexOf(e), done = new Date(e.end) < now;
          const c = 'k' + (e.cancelled ? ' cx' : '') + (done && !e.cancelled ? ' dn' : '') + (e.makeup ? ' mk' : '') + (i === ix.next ? ' nx' : '') + (i === ix.last ? ' ls' : '');
          const tip = hm(s) + ' · ' + s.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) + ' · ' + (e.teacher ? 'Teacher ' + String(e.teacher).replace(/^teacher\s+/i, '') : '') + (e.book ? ' · ' + e.book : '') + (e.cancelled ? ' · cancelled' : '') + (e.makeup ? ' · make-up' : '') + (done && !e.cancelled ? ' · done' : '');
          return '<button type="button" class="' + c + '" style="--c:' + bookCol(e.book) + '" title="' + esc(tip) + '"' + (D && D.mgr ? ' onclick="event.stopPropagation();classEdit(' + i + ',\'stu\')"' : '') + '>' + hm(s) + '</button>'; }).join('') + '</div>'; }
    return '<div class="m"><div class="mt"><b>' + MN[m] + ' ' + y + '</b><span>' + n + ' class' + (n === 1 ? '' : 'es') + (cx ? ' · ' + cx + ' cancelled' : '') + '</span></div><div class="g">' +
      ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(w => '<div class="wd">' + w + '</div>').join('') + cells + '</div></div>'; }
  function cal(){ const L = LL || [], now = Date.now(), by = {};
    L.forEach(e => { const s = new Date(e.start); if(isNaN(s)) return; (by[ymd(s)] = by[ymd(s)] || []).push(e); });
    Object.keys(by).forEach(k => by[k].sort((a, b) => new Date(a.start) - new Date(b.start)));
    const live = L.filter(e => !e.cancelled && new Date(e.end) >= now).sort((a, b) => new Date(a.start) - new Date(b.start));
    const ix = { next: live.length ? L.indexOf(live[0]) : -1, last: live.length ? L.indexOf(live[live.length - 1]) : -1 };
    const t = new Date(), a = new Date(t.getFullYear(), t.getMonth() + OFF, 1), b = new Date(a.getFullYear(), a.getMonth() + 1, 1);
    const lastE = live[live.length - 1], ld = lastE ? new Date(lastE.start) : null;
    return '<div class="ch8"><b>Calendar</b><span class="sp"></span>' + (OFF ? '<button type="button" onclick="cal28Go(0)">Today</button>' : '') +
      '<button type="button" aria-label="Earlier" onclick="cal28Go(-1)">‹</button><button type="button" aria-label="Later" onclick="cal28Go(1)">›</button></div>' +
      '<div class="ms">' + month(a.getFullYear(), a.getMonth(), by, now, ix) + month(b.getFullYear(), b.getMonth(), by, now, ix) + '</div>' +
      '<div class="lg"><span><i style="background:#2B2253"></i>next class</span><span><i style="background:#9A98A8"></i>coming (book colour)</span><span><i style="background:#9A98A8;opacity:.4"></i>done</span><span><i style="box-shadow:inset 0 0 0 1px #F0C9BF;background:#fff"></i>cancelled</span><span><i style="background:#9A98A8;box-shadow:0 0 0 1.5px #fff,0 0 0 3px #00A3AD"></i>make-up</span><span><i style="background:#E0A030;height:7px;width:16px"></i>last booked</span></div>' +
      (live.length ? '<div class="ft"><b>' + live.length + '</b> class' + (live.length === 1 ? '' : 'es') + ' booked · last on <b>' + ld.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + hm(ld) + '</b></div>' : ''); }
  window.cal28Go = function(d){ OFF = d === 0 ? 0 : OFF + d; const el = document.getElementById('cal28'); if(el) el.innerHTML = cal(); };
  const _ss = window.stuSched; if(!_ss) return;
  window.stuSched = function(L){ let h = _ss.apply(this, arguments);
    try{ if(typeof STU !== 'undefined' && STU && window._cal28code !== STU.code){ OFF = 0; window._cal28code = STU.code; }
      LL = Array.isArray(L) ? L : []; const tag = '<h3 class="sch">Coming up</h3>', s = h.indexOf(tag);
      const box = '<div class="cal28' + (D && D.mgr ? ' mg' : '') + '" id="cal28">' + cal() + '</div>';
      if(s >= 0){ let e = h.indexOf('<details class="fbold', s); if(e < 0) e = h.lastIndexOf('</section>');
        const list = h.slice(s + tag.length, e).replace(/\s+$/, '');
        h = h.slice(0, s) + box + '<details class="lv28"><summary>List view · next ' + Math.min(12, LL.filter(x => new Date(x.end) >= Date.now()).length) + '</summary>' + list + '</details>\n' + h.slice(e); }
      else if(LL.length){ const e = h.indexOf('<details class="fbold'); const at = e >= 0 ? e : h.lastIndexOf('</section>'); h = h.slice(0, at) + box + h.slice(at); }
    }catch(err){ console.warn('cal28', err); }
    return h; };
})();
