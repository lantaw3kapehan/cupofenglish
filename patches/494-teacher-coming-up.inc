/* 21 Oct · 494 · Teacher Today › Coming up (Misty: "any better, especially this part"). The six plain day rows become one week strip:
   a tile per day with the day, the number of classes as a bar (busiest day full), and the teaching hours ("18:00–21:30");
   cancelled classes as a small coral count. Tap a day to open its classes right under the strip (tap again to close) — the same
   class rows as before, nothing removed. */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#v-today .wk94{display:grid;grid-template-columns:repeat(var(--n),minmax(0,1fr));gap:8px;margin-top:4px}
#v-today .wk94 a{background:#fff;border:1px solid var(--line);border-radius:14px;padding:10px 10px 9px;cursor:pointer;color:var(--ink);text-decoration:none;display:flex;flex-direction:column;gap:3px;min-width:0;transition:box-shadow .15s}
#v-today .wk94 a:hover{box-shadow:var(--sh1)}
#v-today .wk94 a.on{border-color:#00A3AD;box-shadow:0 0 0 1px #00A3AD inset}
#v-today .wk94 .d{font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#8A86A0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#v-today .wk94 a.tm .d{color:#00737B}
#v-today .wk94 b{font-family:var(--brand);font-weight:400;font-size:24px;line-height:1.1}
#v-today .wk94 b small{font-family:var(--f,inherit);font-size:11.5px;color:#8A86A0;margin-left:3px}
#v-today .wk94 .bar{height:6px;border-radius:3px;background:var(--soft);overflow:hidden} #v-today .wk94 .bar i{display:block;height:100%;border-radius:3px;background:#5FB8BE}
#v-today .wk94 .h{font-size:11px;color:#6F6B85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#v-today .wk94 .x{font-size:10.5px;color:#B4442F;font-weight:700}
#v-today details.wk94d{margin-top:8px!important}
#v-today details.wk94d.h94{display:none}
@media(max-width:700px){ #v-today .wk94{grid-template-columns:repeat(3,minmax(0,1fr))} }`;
  document.head.appendChild(css);
  const hm = d => { const x = new Date(d); return String(x.getHours()).padStart(2, '0') + ':' + String(x.getMinutes()).padStart(2, '0'); };
  let OPEN = '';
  window.wk94 = function(day){ OPEN = OPEN === day ? '' : day; apply(); };
  function apply(){ document.querySelectorAll('#v-today .wk94 a').forEach(a => a.classList.toggle('on', a.dataset.d === OPEN));
    document.querySelectorAll('#v-today details.wk94d').forEach(d => { const on = d.dataset.d === OPEN; d.classList.toggle('h94', !on); d.open = on; }); }
  function paint(){ const v = document.getElementById('v-today'); if(!v || !D || D.mgr || v.querySelector('.wk94')) return;
    const h2 = [...v.querySelectorAll('h2')].find(x => /^Coming up/.test(x.textContent.trim())); if(!h2) return;
    const by = {}; (D.schedule || []).forEach(c => { if(c.day > D.today) (by[c.day] = by[c.day] || []).push(c); });
    const days = Object.keys(by).sort(); if(!days.length) return;
    const dets = []; let n = h2.nextElementSibling; while(n && n.tagName === 'DETAILS'){ dets.push(n); n = n.nextElementSibling; }
    if(dets.length !== days.length) return;   // a layout we do not know: leave it as it was
    const mx = Math.max(1, ...days.map(d => by[d].filter(c => !c.cancelled).length)), tm = new Date(Date.now() + 864e5), tmY = tm.getFullYear() + '-' + String(tm.getMonth() + 1).padStart(2, '0') + '-' + String(tm.getDate()).padStart(2, '0');
    const tiles = days.map(d => { const L = by[d].slice().sort((a, b) => String(a.start).localeCompare(String(b.start))), live = L.filter(c => !c.cancelled), x = L.length - live.length;
      const lab = d === tmY ? 'Tomorrow' : new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
      const span = live.length ? hm(live[0].start) + '–' + hm(live[live.length - 1].end) : 'no classes';
      return '<a data-d="' + d + '" class="' + (d === tmY ? 'tm' : '') + '" onclick="wk94(\'' + d + '\')" title="' + esc(lab + ' · ' + live.length + ' classes · ' + span) + '"><span class="d">' + esc(lab) + '</span><b>' + live.length + '<small>class' + (live.length === 1 ? '' : 'es') + '</small></b>' +
        '<span class="bar"><i style="width:' + Math.round(live.length / mx * 100) + '%"></i></span><span class="h">' + esc(span) + '</span>' + (x ? '<span class="x">' + x + ' cancelled</span>' : '') + '</a>'; }).join('');
    h2.insertAdjacentHTML('afterend', '<div class="wk94" style="--n:' + Math.min(days.length, 7) + '">' + tiles + '</div>');
    dets.forEach((d, i) => { d.classList.add('wk94d'); d.dataset.d = days[i]; v.querySelector('.wk94').parentNode.insertBefore(d, n); });
    const c = h2.querySelector('.c'); if(!c) h2.insertAdjacentHTML('beforeend', ' <span class="c">tap a day for its classes</span>');
    apply(); }
  const _rt = window.renderToday; if(_rt) window.renderToday = function(){ const r = _rt.apply(this, arguments); try{ paint(); }catch(e){ console.warn('wk94', e); } setTimeout(() => { try{ paint(); }catch(e){} }, 300); return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'today') renderToday(); }catch(e){}
})();
