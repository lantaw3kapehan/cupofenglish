/* 21 Oct · 492 · Teacher Today (Misty: "minimal but straightforward, modern and visually effective · the layout we keep from now on").
   · "Your day": one line that answers the day — classes, teaching time, what is next and when — and a day strip: each class as a block in
     its book colour on one line from the first to the last class, cancelled ones hatched, a line for now; tap a block to jump to it.
   · Class cards: the "Last class" note shows two lines (tap to read all), so the three classes fit on one screen.
   · Time-in: coloured edge (teal to do · green done).
   · Class sound and phone reminders: one small settings card instead of a line plus a big card.
   Nothing removed: every button, note and check is where it was. */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#v-today .yd92{background:#fff;border:1px solid var(--line);border-radius:var(--r-lg,18px);box-shadow:var(--sh1);padding:14px 18px 12px;margin:14px 0 6px}
#v-today .yd92 .s{display:flex;flex-wrap:wrap;gap:6px 18px;align-items:baseline;font-size:13.5px;color:#55526E}
#v-today .yd92 .s b{color:var(--ink);font-weight:700}
#v-today .yd92 .s .nx{margin-left:auto;font-size:13px;color:#00737B;font-weight:700}
#v-today .yd92 .st{position:relative;height:40px;margin-top:12px;border-radius:10px;background:repeating-linear-gradient(90deg,#F4F3F8 0 1px,transparent 1px 100%) 0 0/calc(100% / var(--hrs)) 100%,#FAFAFC}
#v-today .yd92 .bk{position:absolute;top:5px;bottom:5px;border-radius:7px;background:var(--c,#5FB8BE);cursor:pointer;display:flex;align-items:center;justify-content:center;overflow:hidden;min-width:6px}
#v-today .yd92 .bk span{font-size:10.5px;font-weight:700;color:#fff;white-space:nowrap;padding:0 4px;text-shadow:0 1px 1px rgba(0,0,0,.15)}
#v-today .yd92 .bk.x{background:repeating-linear-gradient(45deg,#E4E2EC 0 4px,#F2F1F6 4px 8px)} #v-today .yd92 .bk.x span{color:#8A86A0;text-shadow:none;text-decoration:line-through}
#v-today .yd92 .bk.done{opacity:.45}
#v-today .yd92 .nw{position:absolute;top:-3px;bottom:-3px;width:2px;background:#D4705A;border-radius:2px}
#v-today .yd92 .nw:after{content:'now';position:absolute;top:-14px;left:50%;transform:translateX(-50%);font-size:9.5px;font-weight:700;color:#D4705A}
#v-today .yd92 .ax{display:flex;justify-content:space-between;font-size:10.5px;color:#8A86A0;margin-top:4px}
#v-today .cls .note{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;cursor:pointer;position:relative;padding-bottom:0!important;border-bottom:7px solid var(--soft);line-height:1.45}
#v-today .cls .note.long:not(.open):after{content:'more';position:absolute;right:8px;bottom:0;font-size:11px;font-weight:700;color:#00737B;background:linear-gradient(90deg,transparent,var(--soft) 30%);padding-left:24px}
#v-today .cls .note.open{display:block}
#v-today .tin{border-left:4px solid #00A3AD!important}
#v-today .tin.done{border-left-color:#2E9E6F!important;background:linear-gradient(135deg,#EEF8F3,#F7FCF9)!important;border-color:#D3ECDF!important}
#v-today .ps92{display:flex;flex-direction:column;gap:8px;background:#fff;border:1px solid var(--line);border-radius:14px;padding:10px 14px;margin-top:12px;font-size:12.5px;color:#55526E}
#v-today .ps92 .r{display:flex;align-items:center;gap:10px}
#v-today .ps92 .r>span{flex:1;min-width:0}
#v-today .ps92 .r a,#v-today .ps92 .r button{font-size:12.5px}
#v-today .ps92 .remcard,#v-today .ps92 .sndrow{all:unset;display:flex;align-items:center;gap:10px}
#v-today .ps92 .remcard .grow b{font-size:13px}
#v-today .ps92 .remcard .small{font-size:12px}
@media(max-width:640px){ #v-today .yd92{padding:12px 14px 10px} #v-today .yd92 .s .nx{margin-left:0;width:100%} #v-today .yd92 .bk span{font-size:9px} }`;
  document.head.appendChild(css);
  const ICO = { cls: '<path d="M4 5h16v12H4z"/><path d="M8 21h8M12 17v4"/>', time: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>', ok: '<path d="M5 12l4 4 10-10"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>', next: '<path d="M8 5l8 7-8 7z"/>' };
  const ic = (k, c) => '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="' + (c || 'currentColor') + '" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:5px">' + ICO[k] + '</svg>';
  const hm = d => { const x = new Date(d); return String(x.getHours()).padStart(2, '0') + ':' + String(x.getMinutes()).padStart(2, '0'); };
  const dur = m => m >= 60 ? Math.floor(m / 60) + ' h' + (m % 60 ? ' ' + (m % 60) + ' min' : '') : m + ' min';
  window.yd92Go = id => { const el = [...document.querySelectorAll('#v-today .cls')].find(c => c.querySelector('[onclick*="' + id + '"]')); if(el){ el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.animate([{ boxShadow: '0 0 0 3px #00A3AD' }, { boxShadow: '0 0 0 0 transparent' }], { duration: 1400 }); } };
  function day(){ const v = document.getElementById('v-today'); if(!v || !D || D.mgr || v.querySelector('.yd92')) return;
    const L = (D.schedule || []).filter(c => c.day === D.today).sort((a, b) => String(a.start).localeCompare(String(b.start))); if(!L.length) return;
    const live = L.filter(c => !c.cancelled), now = new Date();
    const mins = live.reduce((s, c) => s + Math.round((new Date(c.end) - new Date(c.start)) / 6e4), 0);
    const nx = live.find(c => new Date(c.end) > now), inNow = nx && new Date(nx.start) <= now;
    const left = nx ? Math.round((new Date(nx.start) - now) / 6e4) : 0, done = live.filter(c => new Date(c.end) <= now).length;
    const t0 = Math.floor((Math.min(...L.map(c => +new Date(c.start))) - 15 * 6e4) / 36e5) * 36e5, t1 = Math.ceil((Math.max(...L.map(c => +new Date(c.end))) + 15 * 6e4) / 36e5) * 36e5, sp = t1 - t0;
    const P = x => ((x - t0) / sp * 100).toFixed(2) + '%';
    const blocks = L.map(c => { const a = +new Date(c.start), z = +new Date(c.end), card = [...v.querySelectorAll('.cls')].find(k => k.querySelector('[onclick*="' + c.id + '"]')), col = (card && getComputedStyle(card).getPropertyValue('--c').trim()) || '#5FB8BE';
      return '<div class="bk ' + (c.cancelled ? 'x' : z <= +now ? 'done' : '') + '" style="left:' + P(a) + ';width:calc(' + P(z) + ' - ' + P(a) + ');--c:' + col + '" title="' + esc(hm(a) + ' · ' + (c.student || c.title || '') + (c.cancelled ? ' · cancelled' : '')) + '" onclick="yd92Go(\'' + esc(c.id) + '\')"><span>' + esc(String(c.student || c.title || '').split(' ')[0]) + '</span></div>'; }).join('');
    const nowL = +now > t0 && +now < t1 ? '<i class="nw" style="left:' + P(+now) + '"></i>' : '';
    const hrs = Math.round(sp / 36e5), ax = []; for(let t = t0; t <= t1; t += 36e5 * Math.max(1, Math.ceil(hrs / 8))) ax.push('<span>' + hm(t) + '</span>');
    const next = !nx ? 'All classes done today' : inNow ? 'Now · ' + esc(nx.student || '') + ' until ' + hm(nx.end) : 'Next ' + hm(nx.start) + ' · ' + esc(nx.student || '') + ' · ' + (left >= 60 ? 'in ' + dur(left) : 'in ' + left + ' min');
    const html = '<section class="yd92"><div class="s"><span>' + ic('cls', '#5FB8BE') + '<b>' + live.length + '</b> class' + (live.length === 1 ? '' : 'es') + '</span><span>' + ic('time', '#9A8FD8') + '<b>' + dur(mins) + '</b> teaching</span>' + (done ? '<span>' + ic('ok', '#2E9E6F') + '<b>' + done + '</b> done</span>' : '') + (L.length - live.length ? '<span>' + ic('x', '#D4705A') + (L.length - live.length) + ' cancelled</span>' : '') + '<span class="nx">' + (nx ? ic('next', '#00737B') : '') + next + '</span></div>' +
      '<div class="st" style="--hrs:' + hrs + '">' + blocks + nowL + '</div><div class="ax">' + ax.join('') + '</div></section>';
    const lead = v.querySelector('.lead'); const ml = lead && lead.querySelector(':scope > .mute.small'); if(ml) ml.textContent = ml.textContent.split(' · ')[0]; if(lead) lead.insertAdjacentHTML('afterend', html); else v.insertAdjacentHTML('afterbegin', html); }
  function tidy(){ const v = document.getElementById('v-today'); if(!v || !D || D.mgr) return;
    v.querySelectorAll('.cls .note').forEach(n => { if(n.dataset.c92) return; n.dataset.c92 = 1; n.title = 'Tap to read all'; if(n.scrollHeight > n.clientHeight + 2) n.classList.add('long'); n.addEventListener('click', e => { if(e.target.closest('a,button')) return; n.classList.toggle('open'); }); });
    const snd = v.querySelector('.sndrow'), rem = v.querySelector('.remcard');
    if((snd || rem) && !v.querySelector('.ps92')){ const box = document.createElement('div'); box.className = 'ps92'; const first = snd || rem; first.parentNode.insertBefore(box, first);
      if(snd){ const r = document.createElement('div'); r.className = 'r'; r.appendChild(snd); box.appendChild(r); }
      if(rem){ const r = document.createElement('div'); r.className = 'r'; r.appendChild(rem); box.appendChild(r); } } }
  const _rt = window.renderToday; if(_rt) window.renderToday = function(){ const r = _rt.apply(this, arguments); try{ day(); tidy(); }catch(e){ console.warn('td92', e); } setTimeout(() => { try{ day(); tidy(); }catch(e){} }, 300); return r; };
  setInterval(() => { try{ if(typeof VIEW !== 'undefined' && VIEW === 'today' && D && !D.mgr){ const y = document.querySelector('#v-today .yd92'); if(y){ y.remove(); day(); } } }catch(e){} }, 60000);   // the now line and "in … min" move every minute
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'today') renderToday(); }catch(e){}
})();
