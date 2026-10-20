/* 20 Oct · 393 · The usual weekly schedule in the student header (Misty): one strip across the bottom of the header card —
   🗓 the weekly slots as chips (Sat 15:30 · Sun 11:00), length and teacher, and the next class on the right in teal.
   No weekly classes booked → an amber "No weekly schedule yet" with + Class. From the calendar (next 4 weeks), like the weekly picture. */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#sheetBody.stu2 .shero{flex-wrap:wrap}
#sheetBody.stu2 .shwk{flex-basis:100%;display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:14px;padding-top:12px;border-top:1px solid #F0EFF5}
#sheetBody.stu2 .shwk .lb{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8A86A0;margin-right:2px}
#sheetBody.stu2 .shwk .sl{display:inline-flex;align-items:baseline;gap:6px;padding:6px 12px;border-radius:999px;background:#2B2253;color:#fff;font-size:14px}
#sheetBody.stu2 .shwk .sl b{font-weight:700}
#sheetBody.stu2 .shwk .sl span{opacity:.75;font-size:12px}
#sheetBody.stu2 .shwk .mt{font-size:13px;color:#6F6B85}
#sheetBody.stu2 .shwk .nx{margin-left:auto;font-size:13px;color:#00737B;font-weight:600;white-space:nowrap}
#sheetBody.stu2 .shwk.none .lb{color:#B7791F}
#sheetBody.stu2 .shwk.none .mt{color:#B7791F}
@media(max-width:620px){#sheetBody.stu2 .shwk .nx{margin-left:0;flex-basis:100%}}`;
  document.head.appendChild(css);
  const DS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  function paint(){ const body = $('sheetBody'); if(!body || !body.classList.contains('stu2') || typeof STU === 'undefined' || !STU) return; const hero = body.querySelector('.shero'); if(!hero) return;
    if(!STU.cls){ return; }
    let K = { slots: [], up: [] }; try{ K = wkSlots(STU.cls); }catch(e){}
    const S = (K.slots || []).slice().sort((a, b) => a.w - b.w || a.s.localeCompare(b.s));
    const T = [...new Set(S.map(x => tName ? tName(x.t) : x.t).filter(Boolean))], M = [...new Set(S.map(x => x.m))];
    const nx = (K.up || []).find(e => !e.cancelled);
    const nxs = nx ? new Date(nx.start).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) + ' ' + tm(nx.start) : '';
    const html = S.length
      ? '<span class="lb">🗓 Every week</span>' + S.map(x => '<span class="sl"><b>' + DS[x.w] + '</b>' + esc(x.s) + (T.length > 1 ? '<span>' + esc(tName ? tName(x.t) : x.t) + '</span>' : '') + '</span>').join('') +
        '<span class="mt">' + esc(M.map(m => m + ' min').join(' / ')) + (T.length === 1 ? ' · ' + esc(T[0]) : '') + '</span>' + (nxs ? '<span class="nx">Next · ' + esc(nxs) + '</span>' : '')
      : '<span class="lb">🗓 Every week</span><span class="mt">No weekly schedule yet' + (nxs ? ' · next class ' + esc(nxs) : '') + '</span>' + (D && D.mgr ? '<button class="btn sm ghost" style="margin-left:auto" onclick="classForm(\'' + esc(STU.code) + '\')">+ Class</button>' : '');
    let el = hero.querySelector('.shwk'); if(!el){ hero.insertAdjacentHTML('beforeend', '<div class="shwk"></div>'); el = hero.querySelector('.shwk'); }
    el.classList.toggle('none', !S.length); if(el.innerHTML !== html) el.innerHTML = html; }
  const r0 = window.stuRender; window.stuRender = function(){ const r = r0.apply(this, arguments); setTimeout(paint, 70); return r; };
  try{ const sb = $('sheetBody'); let t = 0; if(sb) new MutationObserver(() => { clearTimeout(t); t = setTimeout(paint, 120); }).observe(sb, { childList: true, subtree: true }); }catch(e){}
})();
