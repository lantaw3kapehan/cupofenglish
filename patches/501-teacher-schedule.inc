/* 21 Oct · 501 · Teacher Schedule, same visual language as Today (Misty: "Now, let's do SCHEDULE SCREEN").
   · One summary card: classes · students · hours, and a taught / still-to-teach bar (green done, teal to go), cancelled shown apart.
   · A load picture: this week / next week = 7 day tiles with a bar for how busy each day is; a month = a small calendar shaded by
     how many classes that day has. Tap a day to jump to it.
   · Day sections: the day, "Today" marked, its count and hours on the right; each class one tidy line (time, book colour, name, code · book).
     A cancelled class is struck through with its reason on one short line (tap to read all).
   · Days already finished fold into "✓ Finished" at the bottom. Leave: on top while something is upcoming or waiting, otherwise at the end.
   Only the Schedule page itself changes; the schedule sheet opened from other places stays as it was. Nothing removed. */
(function(){
  const css = document.createElement('style'); css.textContent = `
#v-tsched .sm501{background:#fff;border:1px solid rgba(43,34,83,.07);border-radius:18px;box-shadow:0 1px 2px rgba(43,34,83,.04),0 10px 28px -16px rgba(43,34,83,.16);padding:14px 16px;margin-top:14px}
#v-tsched .f501{display:flex;flex-wrap:wrap;gap:6px 22px;align-items:center}
#v-tsched .f501 span{display:inline-flex;align-items:center;gap:7px;font-size:14px;color:#4A4766}
#v-tsched .f501 b{font-size:20px;color:#2B2253;font-variant-numeric:tabular-nums;letter-spacing:-.2px}
#v-tsched .f501 svg{width:18px;height:18px;flex:none}
#v-tsched .f501 .cx501 b{font-size:15px;color:#C0533F}
#v-tsched .pb501{margin-top:12px}
#v-tsched .pb501 .bar{display:flex;height:10px;border-radius:999px;background:#E3F3F4;overflow:hidden;gap:2px}
#v-tsched .pb501 .bar i{display:block;background:#2FA36B;border-radius:999px}
#v-tsched .pb501 .bar em{display:block;flex:1;background:linear-gradient(90deg,#9ADCE0,#5EC4CB);border-radius:999px}
#v-tsched .pb501 .lg{display:flex;justify-content:space-between;font-size:12.5px;color:#6B6884;margin-top:6px}
#v-tsched .pb501 .lg b{color:#1E7A55}#v-tsched .pb501 .lg b.tl{color:#00808A}
#v-tsched .wk501{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:8px;margin-top:14px}
#v-tsched .wk501 a{display:flex;flex-direction:column;align-items:center;gap:4px;padding:9px 4px 8px;border-radius:14px;background:#F7F8FB;cursor:pointer;text-decoration:none;color:#4A4766;border:1px solid transparent;transition:background .15s,border-color .15s}
#v-tsched .wk501 a:hover{border-color:rgba(0,163,173,.35)}
#v-tsched .wk501 small{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#8A87A0}
#v-tsched .wk501 .d{font-size:17px;font-weight:700;color:#2B2253;font-variant-numeric:tabular-nums}
#v-tsched .wk501 .h{width:100%;height:34px;display:flex;align-items:flex-end;justify-content:center}
#v-tsched .wk501 .h i{display:block;width:60%;max-width:26px;border-radius:6px 6px 3px 3px;background:#5EC4CB;min-height:3px}
#v-tsched .wk501 .n{font-size:12px;font-weight:700;color:#00808A;font-variant-numeric:tabular-nums}
#v-tsched .wk501 a.z .h i{background:#E4E3EC}#v-tsched .wk501 a.z .n{color:#A3A0B5;font-weight:400}
#v-tsched .wk501 a.p{opacity:.55}#v-tsched .wk501 a.p .h i{background:#9FD7B9}
#v-tsched .wk501 a.t{background:#E6F6F7;border-color:rgba(0,163,173,.45)}#v-tsched .wk501 a.t small,#v-tsched .wk501 a.t .d{color:#00737B}
#v-tsched .mo501{margin-top:14px}
#v-tsched .mo501 .g{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px}
#v-tsched .mo501 .g>small{text-align:center;font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:#8A87A0;padding-bottom:2px}
#v-tsched .mo501 .g a{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;height:46px;border-radius:11px;background:#F4F4F8;color:#8A87A0;cursor:pointer;text-decoration:none;font-size:12px;font-variant-numeric:tabular-nums;border:1px solid transparent}
#v-tsched .mo501 .g a b{font-size:14px;line-height:1.1}
#v-tsched .mo501 .g a em{font-style:normal;font-size:10.5px;font-weight:700;opacity:.9}
#v-tsched .mo501 .g a.l1{background:#DDF2F3;color:#1F5F64}#v-tsched .mo501 .g a.l2{background:#A9DFE3;color:#154A4F}
#v-tsched .mo501 .g a.l3{background:#5EC4CB;color:#fff}#v-tsched .mo501 .g a.l4{background:#00939D;color:#fff}
#v-tsched .mo501 .g a.p{opacity:.5}#v-tsched .mo501 .g a.t{border-color:#2B2253;box-shadow:0 0 0 1px #2B2253 inset}
#v-tsched .mo501 .g a:hover{border-color:rgba(0,163,173,.6)}#v-tsched .mo501 .g i{visibility:hidden}
#v-tsched .mo501 .k{display:flex;align-items:center;gap:6px;justify-content:flex-end;font-size:11.5px;color:#8A87A0;margin-top:8px}
#v-tsched .mo501 .k span{width:14px;height:10px;border-radius:3px;display:inline-block}
#v-tsched .dl501{margin-top:14px}
#v-tsched .dy501{background:#fff;border:1px solid rgba(43,34,83,.07);border-radius:18px;box-shadow:0 1px 2px rgba(43,34,83,.04),0 10px 28px -18px rgba(43,34,83,.14);padding:6px 6px 6px;margin-bottom:10px;scroll-margin-top:84px}
#v-tsched .dy501>.hd501{display:flex;align-items:center;gap:10px;padding:8px 10px 6px}
#v-tsched .dy501 .dn{width:38px;height:38px;border-radius:12px;background:#F2F1F7;display:grid;place-items:center;font-weight:700;font-size:16px;color:#2B2253;flex:none;font-variant-numeric:tabular-nums}
#v-tsched .dy501 .ws{display:none}#v-tsched .dy501 .dw{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;font-size:14px;color:#2B2253}#v-tsched .dy501 .dw b{font-size:15px}
#v-tsched .dy501 .dw .tg{display:inline-block;margin-left:6px;padding:1px 8px;border-radius:999px;background:#00939D;color:#fff;font-size:11.5px;font-weight:700;vertical-align:1px}
#v-tsched .dy501 .dc{font-size:12.5px;color:#6B6884;white-space:nowrap;font-variant-numeric:tabular-nums}
#v-tsched .dy501.t{border-color:rgba(0,163,173,.4);box-shadow:0 0 0 1px rgba(0,163,173,.25),0 12px 30px -18px rgba(0,163,173,.4)}
#v-tsched .dy501.t .dn{background:#00939D;color:#fff}
#v-tsched .r501{display:flex;align-items:flex-start;gap:12px;padding:8px 10px;border-radius:12px}
#v-tsched .r501+.r501{border-top:1px solid #F1F0F5}
#v-tsched .r501 .tm{width:50px;flex:none;font-variant-numeric:tabular-nums;line-height:1.2}
#v-tsched .r501 .tm b{display:block;font-size:15px;color:#2B2253}#v-tsched .r501 .tm small{font-size:11.5px;color:#8A87A0}
#v-tsched .r501 .bk{width:4px;align-self:stretch;border-radius:4px;background:var(--c,#5EC4CB);flex:none;min-height:34px}
#v-tsched .r501 .nm{flex:1;min-width:0;line-height:1.3}
#v-tsched .r501 .nm b{font-size:15px;color:#2B2253}
#v-tsched .r501 .nm .sb{display:block;font-size:12.5px;color:#8A87A0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#v-tsched .r501 .chip{font-size:11px;padding:1px 8px;margin-left:4px;vertical-align:1px}
#v-tsched .r501.fin{opacity:.5}
#v-tsched .r501.now{background:linear-gradient(90deg,#E6F6F7,#fff 75%)}
#v-tsched .r501.cx .tm b,#v-tsched .r501.cx .nm>b{text-decoration:line-through;color:#A3A0B5}
#v-tsched .r501.cx .bk{background:repeating-linear-gradient(180deg,var(--c,#ccc) 0 4px,transparent 4px 7px)}
#v-tsched .r501 .why{display:block;margin-top:3px;font-size:12.5px;color:#9A4B3C;background:#FCF1EE;border-radius:8px;padding:3px 8px;cursor:pointer;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
#v-tsched .r501 .why.open{white-space:normal}#v-tsched .r501 .why.none{color:#A3A0B5;background:#F5F5F8;font-style:italic;cursor:default}
#v-tsched .r501 .why .cxby{color:#8A87A0}
#v-tsched .r501 .lv{display:inline-flex;align-items:center;gap:5px;margin-left:6px;font-size:11.5px;font-weight:700;color:#00808A}
#v-tsched .r501 .lv i{width:7px;height:7px;border-radius:50%;background:#00B894;animation:liveP 1.6s infinite}
#v-tsched .nn501{padding:6px 10px 8px;font-size:13px;color:#A3A0B5}
#v-tsched details.fd501{margin-top:6px}
#v-tsched details.fd501>summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:14px;background:#F3FAF6;border:1px solid #CDE9DA;color:#1E7A55;font-weight:700;font-size:14px}
#v-tsched details.fd501>summary::-webkit-details-marker{display:none}
#v-tsched details.fd501>summary span{font-weight:400;color:#4F8A6E}
#v-tsched details.fd501>summary::after{content:'›';margin-left:auto;transition:transform .15s}#v-tsched details.fd501[open]>summary::after{transform:rotate(90deg)}
#v-tsched details.fd501>div{margin-top:10px}
#v-tsched .ld501 .seg{margin-top:10px}
@media(max-width:560px){
  #v-tsched .sm501{padding:12px 12px}#v-tsched .f501{gap:6px 14px}#v-tsched .f501 b{font-size:18px}
  #v-tsched .wk501{gap:4px}#v-tsched .wk501 a{padding:7px 2px 6px;border-radius:11px}#v-tsched .wk501 .d{font-size:15px}#v-tsched .wk501 small{font-size:10px;letter-spacing:.03em}
  #v-tsched .mo501 .g{gap:3px}#v-tsched .mo501 .g a{height:40px;border-radius:9px}
  #v-tsched .r501{gap:9px;padding:8px 6px}#v-tsched .dy501 .wl{display:none}#v-tsched .dy501 .ws{display:inline}#v-tsched .r501 .tm{width:44px}
}`;
  document.head.appendChild(css);
  const ic = {
    cls: '<svg viewBox="0 0 24 24" fill="none" stroke="#3F51B5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
    stu: '<svg viewBox="0 0 24 24" fill="none" stroke="#C2557A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M3 20c.6-3.4 3-5.2 6-5.2s5.4 1.8 6 5.2"/><circle cx="17.5" cy="9" r="2.4"/><path d="M16.5 14.6c2.3.2 4 1.7 4.5 4.4"/></svg>',
    hrs: '<svg viewBox="0 0 24 24" fill="none" stroke="#7B5CC4" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
    cx: '<svg viewBox="0 0 24 24" fill="none" stroke="#C0533F" stroke-width="2.2" stroke-linecap="round"><path d="M7 7l10 10M17 7L7 17"/></svg>' };
  const hrs = m => { const h = Math.floor(m / 60), r = Math.round(m % 60); return h && r ? h + ' h ' + r : h ? h + ' h' : r + ' min'; };
  const wd = (d, o) => d.toLocaleDateString('en-GB', o);
  window.ts501Go = y => { const el = document.getElementById('tsd-' + y); if(!el) return; const f = el.closest('details'); if(f) f.open = true;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' }); el.animate && el.animate([{ boxShadow: '0 0 0 3px rgba(0,163,173,.55)' }, { boxShadow: '0 0 0 0 rgba(0,163,173,0)' }], { duration: 1200 }); };
  function paint(){
    const t = TS; if(!t || !t.events) return false; const v = $('v-tsched'); if(!v) return false;
    const E = t.events, live = E.filter(e => !e.cancelled), cx = E.filter(e => e.cancelled), today = ymdLocal(new Date()), now = Date.now();
    const mins = live.reduce((a, e) => a + (new Date(e.end) - new Date(e.start)) / 6e4, 0), stu = new Set(live.map(e => e.code || e.student)).size;
    const done = live.filter(e => new Date(e.end) <= now).length, left = live.length - done;
    const first = new Date(t.from + 'T12:00:00'), last = new Date(t.from + 'T12:00:00'); last.setDate(last.getDate() + t.days - 1);
    const seg = [['week','This week'],['next','Next week'],['month','This month'],['nextm','Next month']];
    const days = []; for(let k = 0; k < t.days; k++){ const d = new Date(t.from + 'T12:00:00'); d.setDate(d.getDate() + k); const y = ymdLocal(d);
      const L = E.filter(e => e.day === y).sort((a, b) => String(a.start).localeCompare(String(b.start))); days.push({ d, y, L, n: L.filter(e => !e.cancelled).length }); }
    const mx = Math.max(1, ...days.map(x => x.n));
    /* summary */
    let h = `<div class="lead ld501"><h1>Schedule</h1><div class="mute small">${esc(wd(first, { day: 'numeric', month: 'short' }))} – ${esc(wd(last, { day: 'numeric', month: 'short', year: 'numeric' }))} · from the CupOfEnglish calendar</div>
<div class="seg">${seg.map(([k, l]) => `<button class="${t.k === k ? 'on' : ''}" onclick="tsOpen('${k}')">${l}</button>`).join('')}</div></div>`;
    h += `<section class="sm501"><div class="f501"><span title="Classes">${ic.cls}<b>${live.length}</b> class${live.length === 1 ? '' : 'es'}</span><span title="Students">${ic.stu}<b>${stu}</b> student${stu === 1 ? '' : 's'}</span><span title="Hours teaching">${ic.hrs}<b>${esc(hrs(mins))}</b> teaching</span>${cx.length ? `<span class="cx501" title="Cancelled">${ic.cx}<b>${cx.length}</b> cancelled</span>` : ''}</div>`;
    if(live.length) h += `<div class="pb501"><div class="bar">${done ? `<i style="width:${(done / live.length * 100).toFixed(1)}%"></i>` : ''}${left ? '<em></em>' : ''}</div><div class="lg"><span><b>✓ ${done}</b> taught</span><span><b class="tl">${left}</b> still to teach</span></div></div>`;
    /* load picture */
    if(t.days <= 7){ h += `<div class="wk501">${days.map(x => `<a class="${x.y === today ? 't' : x.y < today ? 'p' : ''} ${x.n ? '' : 'z'}" onclick="ts501Go('${x.y}')" title="${esc(wd(x.d, { weekday: 'long', day: 'numeric', month: 'short' }))} · ${x.n} class${x.n === 1 ? '' : 'es'}"><small>${esc(x.y === today ? 'Today' : wd(x.d, { weekday: 'short' }))}</small><span class="d">${x.d.getDate()}</span><span class="h"><i style="height:${x.n ? Math.max(12, Math.round(x.n / mx * 100)) : 9}%"></i></span><span class="n">${x.n || '–'}</span></a>`).join('')}</div>`; }
    else { const lead = (first.getDay() + 6) % 7, lv = n => !n ? '' : n <= mx * .25 ? 'l1' : n <= mx * .5 ? 'l2' : n <= mx * .75 ? 'l3' : 'l4';
      h += `<div class="mo501"><div class="g">${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(x => `<small>${x}</small>`).join('')}${'<i></i>'.repeat(lead)}${days.map(x => `<a class="${lv(x.n)} ${x.y === today ? 't' : x.y < today ? 'p' : ''}" ${x.n || x.L.length ? `onclick="ts501Go('${x.y}')"` : ''} title="${esc(wd(x.d, { weekday: 'long', day: 'numeric', month: 'short' }))} · ${x.n} class${x.n === 1 ? '' : 'es'}"><b>${x.d.getDate()}</b>${x.n ? `<em>${x.n}</em>` : ''}</a>`).join('')}</div>
<div class="k">Fewer<span style="background:#DDF2F3"></span><span style="background:#A9DFE3"></span><span style="background:#5EC4CB"></span><span style="background:#00939D"></span>More classes</div></div>`; }
    h += `</section>`;
    /* leave on top while something is upcoming or waiting */
    const lvH = typeof tlvHtml === 'function' ? tlvHtml() : '', lvBusy = !!(typeof TLV !== 'undefined' && TLV && (TLV.rows || []).some(r => r.status === 'Pending' || r.to >= today));
    if(lvBusy) h += lvH;
    /* days */
    const row = e => { const a = new Date(e.start), z = new Date(e.end), on = !e.cancelled && now >= a && now < z, m = Math.round((z - a) / 6e4);
      return `<div class="r501 ${e.cancelled ? 'cx' : ''} ${on ? 'now' : ''} ${now >= z && !on ? 'fin' : ''}" style="--c:${svCol(e.book || e.code)}"><span class="tm"><b>${tm(e.start)}</b><small>${m} min</small></span><span class="bk"></span>
<span class="nm"><b>${esc(e.student || e.title || '')}</b>${e.type ? `<span class="chip ${e.type === 'Trial' ? 'coral' : ''}">${esc(e.type)}</span>` : ''}${e.cancelled ? '<span class="chip red">Cancelled</span>' : ''}${on ? '<span class="lv"><i></i>Live</span>' : ''}
<span class="sb">${esc([e.code, e.book].filter(Boolean).join(' · '))}</span>${e.cancelled ? (e.why ? `<span class="why" onclick="this.classList.toggle('open')" title="Tap to read all">${cxWhy(e.why)}</span>` : '<span class="why none">No reason given</span>') : ''}</span></div>`; };
    const dayH = x => { const m = x.L.filter(e => !e.cancelled).reduce((a, e) => a + (new Date(e.end) - new Date(e.start)) / 6e4, 0), c = x.L.length - x.n;
      return `<section class="dy501 ${x.y === today ? 't' : ''}" id="tsd-${x.y}"><div class="hd501"><span class="dn">${x.d.getDate()}</span><span class="dw"><b><span class="wl">${esc(wd(x.d, { weekday: 'long' }))}</span><span class="ws">${esc(wd(x.d, { weekday: 'short' }))}</span></b> <span class="mute">${esc(wd(x.d, { day: 'numeric', month: 'short' }))}</span>${x.y === today ? '<span class="tg">Today</span>' : ''}</span>
<span class="dc">${x.n ? `${x.n} class${x.n === 1 ? '' : 'es'} · ${esc(hrs(m))}` : 'No classes'}${c ? ` · <span style="color:#C0533F">${c} cancelled</span>` : ''}</span></div>
${x.L.length ? (x.y === today ? svNowFirst(x.L) : x.L).map(row).join('') : '<div class="nn501">Free day</div>'}</section>`; };
    const up = [], fin = [];
    days.forEach(x => { if(!x.L.length && t.days > 7) return; (x.y < today ? fin : up).push(x); });
    h += `<div class="dl501">${up.length ? up.map(dayH).join('') : '<div class="sm501" style="color:#8A87A0">No more classes in this period.</div>'}`;
    if(fin.length){ const n = fin.reduce((a, x) => a + x.n, 0); h += `<details class="fd501"><summary>✓ Finished <span>· ${fin.length} day${fin.length === 1 ? '' : 's'} · ${n} class${n === 1 ? '' : 'es'}</span></summary><div>${fin.slice().reverse().map(dayH).join('')}</div></details>`; }
    h += `</div>`;
    if(!lvBusy) h += lvH;
    /* keep what was open, the scroll position, and skip the redraw when nothing changed */
    if(v.dataset.k501 === h) return true;
    const sc = window.scrollY, fo = !!v.querySelector('details.fd501[open]'), wo = [...v.querySelectorAll('.why.open')].map(x => x.textContent);
    v.innerHTML = h; v.dataset.k501 = h;
    if(fo){ const f = v.querySelector('details.fd501'); if(f) f.open = true; }
    if(wo.length) v.querySelectorAll('.why').forEach(x => { if(wo.includes(x.textContent)) x.classList.add('open'); });
    if(Math.abs(window.scrollY - sc) > 2) window.scrollTo(0, sc);
    return true; }
  const _p = window.tsPaint;
  if(_p) window.tsPaint = tsPaint = function(){ try{ const teacher = typeof D !== 'undefined' && D && !D.mgr;
    if(teacher && typeof VIEW !== 'undefined' && VIEW === 'tsched' && paint()) return; }catch(e){ console.error('schedule 501', e); } return _p.apply(this, arguments); };
})();
