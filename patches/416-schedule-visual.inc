/* 20 Oct · 416 · Schedule, visual and compact (Misty: "let us do the Schedule screen").
   · "Day at a glance": classes per hour as columns (done · live now · coming · cancelled) with a "now" line;
     click a column to jump to that hour.
   · Rows half as tall: student and chips on the first line, teacher · code · book · meeting ID and the status chips
     (time-in, reminders, validity) flow on the second line.
   · Hour headers ("17:00 · 6 classes") split the list so the eye finds a time quickly. */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#v-schedule .dg16{background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);box-shadow:var(--sh1);padding:12px 16px 8px;margin-top:12px}
#v-schedule .dg16 .h{display:flex;justify-content:space-between;align-items:baseline;font-size:12px;color:#8A86A0;margin-bottom:4px}
#v-schedule .dg16 .h b{font-size:13.5px;color:var(--ink)}
#v-schedule .dg16 .k{display:flex;gap:12px}
#v-schedule .dg16 .k span{display:inline-flex;align-items:center;gap:5px}
#v-schedule .dg16 .k i{width:9px;height:9px;border-radius:2px;display:inline-block}
#v-schedule .dg16 .cs{position:relative;display:flex;justify-content:center;align-items:flex-end;gap:4px;height:92px;padding-top:14px}
#v-schedule .dg16 .c{flex:1;max-width:56px;display:flex;flex-direction:column-reverse;align-items:stretch;height:100%;cursor:pointer;min-width:0;position:relative}
#v-schedule .dg16 .c:hover{background:#F6FAFA;border-radius:6px}
#v-schedule .dg16 .c i{display:block;margin:0 3px}
#v-schedule .dg16 .c i:last-of-type{border-radius:3px 3px 0 0}
#v-schedule .dg16 .c b{position:absolute;left:0;right:0;text-align:center;font-size:10.5px;color:var(--ink);font-weight:600}
#v-schedule .dg16 .ax{display:flex;justify-content:center;gap:4px;font-size:10.5px;color:#8A86A0;margin-top:3px}
#v-schedule .dg16 .ax span{flex:1;max-width:56px;text-align:center}
#v-schedule .dg16 .nw{position:absolute;top:6px;bottom:0;border-left:1.5px dashed #00A3AD}
#v-schedule .dg16 .nw:after{content:'now';position:absolute;top:-6px;left:3px;font-size:10px;color:#00808A}
#v-schedule .hh16{display:flex;align-items:baseline;gap:8px;margin:16px 4px 6px;scroll-margin-top:90px}
#v-schedule .hh16 b{font-family:var(--brand);font-weight:400;font-size:17px;color:var(--ink)}
#v-schedule .hh16 span{font-size:12px;color:#8A86A0}
#v-schedule .hh16:after{content:'';flex:1;border-top:1px solid var(--line);margin-left:6px;align-self:center}
@media(min-width:900px){
  #v-schedule .cls{padding:8px 14px 8px 10px!important;margin-bottom:6px!important;align-items:center}
  #v-schedule .cls .t b{font-size:16px}
  #v-schedule .cls .grow{display:flex;flex-wrap:wrap;align-items:center;column-gap:10px;row-gap:4px}
  #v-schedule .cls .grow>.row:first-child{flex-basis:100%}
  #v-schedule .cls .grow>.small.mute{flex:0 1 auto}
  #v-schedule .cls .grow .mon,#v-schedule .cls .grow .ti-tags{margin:0!important}
  #v-schedule .cls .grow>*:not(.row){margin-top:0!important}
  #v-schedule .cls .chip,#v-schedule .cls .rem,#v-schedule .cls [class*="chip"]{font-size:12px!important;padding:3px 9px!important}
}`;
  document.head.appendChild(css);
  const hh = h => String(h).padStart(2, '0') + ':00';
  function paint(){ const v = $('v-schedule'); if(!v || typeof SC === 'undefined' || !SC || !SC.events) return;
    const E = SC.events, now = Date.now(), today = !SC_OFF;
    /* day at a glance */
    if(!v.querySelector('.dg16')){ const by = {}; E.forEach(e => { const d = new Date(e.start), h = d.getHours(); const o = by[h] = by[h] || { done: 0, on: 0, next: 0, cx: 0 };
        if(e.cancelled) o.cx++; else if(new Date(e.end) <= now) o.done++; else if(new Date(e.start) <= now) o.on++; else o.next++; });
      const hs = Object.keys(by).map(Number); if(hs.length){ const a = Math.min(...hs), b = Math.max(...hs), H = []; for(let h = a; h <= b; h++) H.push(h);
        const mx = Math.max(1, ...H.map(h => { const o = by[h] || {}; return (o.done || 0) + (o.on || 0) + (o.next || 0) + (o.cx || 0); })), px = n => Math.round(n / mx * 66);
        const seg = (n, c) => n ? '<i style="height:' + px(n) + 'px;background:' + c + '"></i>' : '';
        const nd = new Date(), nowPos = today ? ((nd.getHours() + nd.getMinutes() / 60) - a) / (b - a + 1) * 100 : -1;
        const html = '<div class="dg16"><div class="h"><b>Day at a glance</b><span class="k"><span><i style="background:#9ED9DD"></i>done</span><span><i style="background:#00A3AD"></i>live</span><span><i style="background:#2B2253"></i>coming</span><span><i style="background:#F0C9BF"></i>cancelled</span></span></div>' +
          '<div class="cs">' + H.map(h => { const o = by[h] || {}, t = (o.done || 0) + (o.on || 0) + (o.next || 0); return '<div class="c" title="' + hh(h) + ' · ' + t + ' classes' + (o.cx ? ' · ' + o.cx + ' cancelled' : '') + '" onclick="sc16Go(' + h + ')">' + seg(o.done, '#9ED9DD') + seg(o.on, '#00A3AD') + seg(o.next, '#2B2253') + seg(o.cx, '#F0C9BF') + (t ? '<b style="bottom:' + (px(t + (o.cx || 0)) + 2) + 'px">' + t + '</b>' : '') + '</div>'; }).join('') +
          (nowPos >= 0 && nowPos <= 100 ? '<span class="nw" style="left:' + nowPos + '%"></span>' : '') + '</div><div class="ax">' + H.map(h => '<span>' + h + '</span>').join('') + '</div></div>';
        const sum = v.querySelector('.s2-sum'); if(sum) sum.insertAdjacentHTML('afterend', html); } }
    /* hour headers (By time) */
    if(SC_BY === 'time' && !v.querySelector('.hh16')){ let last = -1; const rows = [...v.querySelectorAll('.cls')];
      const count = {}; rows.forEach(r => { const t = r.querySelector('.t b'); const h = t ? parseInt(t.textContent, 10) : NaN; if(!isNaN(h) && !r.classList.contains('x')) count[h] = (count[h] || 0) + 1; });
      rows.forEach(r => { const t = r.querySelector('.t b'); const h = t ? parseInt(t.textContent, 10) : NaN; if(isNaN(h) || h === last) return;
        if(r.parentElement && r.parentElement.style && r.parentElement.style.opacity) return;   /* finished list keeps its own header */
        last = h; r.insertAdjacentHTML('beforebegin', '<div class="hh16" id="sch-h' + h + '"><b>' + hh(h) + '</b><span>' + (count[h] || 0) + ' class' + (count[h] === 1 ? '' : 'es') + '</span></div>'); }); }
  }
  window.sc16Go = function(h){ const el = $('sch-h' + h) || [...document.querySelectorAll('#v-schedule .cls')].find(r => { const t = r.querySelector('.t b'); return t && parseInt(t.textContent, 10) === h; });
    if(el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const base = window.renderSchedule; window.renderSchedule = function(){ const r = base.apply(this, arguments); try{ paint(); }catch(e){ console.warn('sc16', e); } return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'schedule') renderSchedule(); }catch(e){}
})();
