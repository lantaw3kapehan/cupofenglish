/* 2773 (Misty 23 Nov 13:03: "I still prefer this one, way cleaner and all needed is still here" · option A mock-up):
   the teacher's Today screen drawn as one focus card for the next class and a clean day table.
   · NEXT CLASS: time · student · book, one line with the last class and the meeting ID, Class brief and Open book.
     "Details" opens the full class card (time-in, homework, note, video) right under it.
   · REST OF TODAY: a table · time · student · book and unit · In / Homework / Note / Video · Open. Open shows the full class card in the row.
   · DONE TODAY (folded): the finished classes, a missing step in coral.
   · NEEDS YOU (right column): the tasks from management and Operations, opened with one click.
   The old cards are not rebuilt: they stay on the page (hidden) and are shown inside the table when a row is opened, so every button keeps working. */
(function(){ if(window.__p2773) return; window.__p2773 = 1;
  const css = document.createElement('style'); css.id = 's2773'; css.textContent = `
body.tv2 #v-today > .nn1104,body.tv2 #v-today > .yd92,body.tv2 #v-today > #urg2001,body.tv2 #v-today .lead .gline{display:none!important}
body.tv2 #v-today > .td1104:not(.show2773){display:none!important}
body.tv2 #v-today .tcol-main > :not(#tv2):not(.keep2773){display:none!important}
#tv2 .lb{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#8A879C;font-weight:700;margin:0 0 10px}
#tv2 .fc{background:#fff;border:1px solid #E7E5EE;border-radius:16px;padding:20px 22px;margin-bottom:24px}
#tv2 .fc .top{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
#tv2 .fc .tm{font:700 26px Inter,sans-serif;color:#2F2752;font-variant-numeric:tabular-nums;margin-right:10px}
#tv2 .fc .nm{font-family:"COE Card Fredoka","Fredoka One",Fredoka,sans-serif;font-size:24px;color:#2F2752;margin-right:10px;cursor:pointer}
#tv2 .fc .meta{color:#77738F;font-size:14px;margin-top:6px}
#tv2 .fc .acts{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
#tv2 .b2{display:inline-flex;align-items:center;justify-content:center;height:38px;padding:0 16px;border-radius:999px;border:1px solid #D9D6E4;background:#fff;color:#2F2752;font:600 14px Inter,sans-serif;cursor:pointer;white-space:nowrap}
#tv2 .b2.p{background:#0E7C7B;border-color:#0E7C7B;color:#fff}
#tv2 .b2.s{height:32px;padding:0 13px;font-size:13px}
#tv2 .b2.lk{border:0;background:none;color:#0E6F68;padding:0 6px}
#tv2 .chip{display:inline-flex;align-items:center;gap:6px;border:1px solid #E3E1EA;border-radius:999px;padding:3px 10px;font-size:13px;font-weight:600;color:#2F2752;white-space:nowrap;background:#fff}
#tv2 .chip i{width:8px;height:8px;border-radius:50%;display:inline-block}
#tv2 table{width:100%;border-collapse:collapse;font-size:14.5px;background:#fff}
#tv2 .tw{background:#fff;border:1px solid #E7E5EE;border-radius:16px;overflow:hidden}
#tv2 th{padding:12px 16px;font-size:12px;font-weight:600;color:#8A879C;text-align:left}
#tv2 td{padding:12px 16px;border-top:1px solid #F1EFF6;vertical-align:middle}
#tv2 td.t{font-weight:700;font-variant-numeric:tabular-nums;color:#2F2752;white-space:nowrap}
#tv2 td.n b{color:#2F2752;cursor:pointer}#tv2 td.n small{color:#8A879C;margin-left:4px}
#tv2 tr.x td{color:#B9B6C8}#tv2 tr.x td.t{text-decoration:line-through;color:#B9B6C8}
#tv2 .st{display:flex;gap:5px}
#tv2 .st span{width:26px;height:24px;border-radius:7px;display:grid;place-items:center;font-size:11.5px;font-weight:700;background:#F1F0F5;color:#A3A0B5}
#tv2 .st span.d{background:#E3F4EC;color:#1D7A52}#tv2 .st span.n{background:#FCECE7;color:#B4472F}
#tv2 td.a{text-align:right;white-space:nowrap}
#tv2 tr.ex > td{padding:0 12px 12px;border-top:0;background:#FAFAFC}
#tv2 tr.ex .cls{margin:0!important;box-shadow:none!important}
#tv2 tr.op > td{background:#FAFAFC}
#tv2 .fx{margin-top:14px}
#tv2 .fx .cls{margin:0!important;box-shadow:none!important}
#tv2 details.dn{margin-top:16px}
#tv2 details.dn summary{cursor:pointer;list-style:none;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#8A879C;font-weight:700;padding:6px 0}
#tv2 details.dn summary::-webkit-details-marker{display:none}
#tv2 details.dn summary::after{content:' · show';text-transform:none;letter-spacing:0;font-weight:600;color:#0E6F68}
#tv2 details.dn[open] summary::after{content:' · hide'}
#tv2 .hint{color:#8A879C;font-size:13px;margin-top:10px}
#tv2 .emp{background:#fff;border:1px dashed #DAD7E3;border-radius:16px;padding:22px;color:#8A879C;text-align:center}
#ny2773{background:#fff;border:1px solid #E7E5EE;border-radius:16px;padding:16px;margin-bottom:14px}
#ny2773 .lb{font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#8A879C;font-weight:700;margin:0 0 8px}
#ny2773 .it{font-weight:600;color:#2F2752;font-size:14.5px;margin-bottom:4px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
#ny2773 .b2{display:inline-flex;align-items:center;height:32px;padding:0 13px;border-radius:999px;border:1px solid #D9D6E4;background:#fff;color:#2F2752;font:600 13px Inter,sans-serif;cursor:pointer;margin-top:8px}
@media(max-width:760px){#tv2 th:nth-child(3),#tv2 td.bk{display:none}#tv2 td,#tv2 th{padding:10px 8px}#tv2 .fc{padding:16px}}`;
  document.head.appendChild(css);
  const E = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const p2 = n => (n < 10 ? '0' : '') + n, hm = d => p2(d.getHours()) + ':' + p2(d.getMinutes());
  const span = m => m < 60 ? m + ' min' : Math.floor(m / 60) + ' h' + (m % 60 ? ' ' + (m % 60) + ' min' : '');
  const idOf = card => { const b = card.querySelector('[onclick^="classBrief("]'); return b && (b.getAttribute('onclick').match(/classBrief\('([^']+)'/) || [])[1]; };
  const HOME = new Map(), OPEN = new Set(); let SIG = '', FOCUS_OPEN = false;
  function home(card){ if(!HOME.has(card)) HOME.set(card, { p: card.parentNode, n: card.nextSibling }); }
  function sendHome(){ HOME.forEach((h, card) => { try{ if(h.p && h.p.isConnected && card.parentNode !== h.p){ if(h.n && h.n.parentNode === h.p) h.p.insertBefore(card, h.n); else h.p.appendChild(card); } }catch(e){} }); HOME.clear(); }
  function cards(v){ const m = new Map(); v.querySelectorAll('.cls').forEach(c => { const id = idOf(c); if(id && !m.has(id)) m.set(id, c); }); return m; }
  function steps(card){ const S = card ? [...card.querySelectorAll('.cs93 > span')] : []; if(S.length < 4) return null; return S.slice(0, 4).map(x => x.classList.contains('d') ? 'd' : x.classList.contains('n') ? 'n' : 'l'); }
  function info(c, card){ const bar = card && card.querySelector('.bar'), col = bar ? getComputedStyle(bar).backgroundColor : '#8C88A3';
    const bk = card && card.querySelector('.bkchip'), unit = card && card.querySelector('.cact .bkb'), ut = unit ? unit.textContent.trim() : '';
    const book = (bk ? bk.textContent.trim() : String(c.book || '').replace(/([a-z])([A-Z])/g, '$1 $2')) || 'Class';
    const u = /^Unit\s+(\d+)/i.exec(ut); const note = card && card.querySelector('.note'); const last = note ? note.textContent.replace(/^\s*Last class:\s*/i, '').trim() : '';
    return { col, book, unitTxt: ut, unitShort: u ? 'U' + u[1] : '', last, st: steps(card), trial: c.type === 'Trial' }; }
  function stepsHtml(st, trial){ if(!st) return trial ? '<span class="muted" style="color:#8A879C;font-size:13px">Trial</span>' : ''; const L = ['In', 'H', 'N', 'V'], T = ['Time-in', 'Homework', 'Class note', 'Video'];
    return '<div class="st">' + st.map((s, i) => '<span class="' + s + '" title="' + T[i] + (s === 'd' ? ' · done' : s === 'n' ? ' · to do' : ' · later') + '">' + L[i] + '</span>').join('') + '</div>'; }
  function build(){ try{
    if(typeof D === 'undefined' || !D || D.mgr){ document.body.classList.remove('tv2'); return; }
    const v = document.getElementById('v-today'); if(!v || !v.childElementCount) return; const main = v.querySelector('.tcols > .tcol-main'), side = v.querySelector('.tcols > .tcol-side'); if(!main) return;
    const now = Date.now(), all = (D.schedule || []).filter(c => c && c.day === D.today).sort((a, b) => String(a.start).localeCompare(String(b.start)));
    const C = cards(v), live = all.filter(c => !c.cancelled);
    const focus = live.find(c => +new Date(c.end) >= now) || null;
    const rest = all.filter(c => c !== focus && (c.cancelled ? +new Date(c.end) >= now : +new Date(c.end) >= now));
    const done = all.filter(c => +new Date(c.end) < now && c !== focus);
    const sig = JSON.stringify([D.today, all.map(c => [c.id, c.cancelled, C.has(c.id) && (steps(C.get(c.id)) || []).join('')]), focus && focus.id, Math.floor(now / 6e4), [...OPEN], FOCUS_OPEN]);
    let box = document.getElementById('tv2'); if(box && box.parentNode !== main){ box.remove(); box = null; }
    document.body.classList.add('tv2');
    /* the greeting line: the date and the day's classes and teaching time */
    try{ const sm = v.querySelector('.lead > .mute.small, .lead > .small.mute'); if(sm){ const mins = live.reduce((a, c) => a + Math.round((new Date(c.end) - new Date(c.start)) / 6e4), 0), d = new Date(D.today + 'T12:00:00');
      const t = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) + (live.length ? ' · ' + live.length + ' class' + (live.length === 1 ? '' : 'es') + ' · ' + span(mins) + ' teaching' : ''); if(sm.textContent !== t) sm.textContent = t; } }catch(e){}
    needsYou(v, side);
    if(box && sig === SIG) return; SIG = sig;
    sendHome();
    if(!box){ box = document.createElement('div'); box.id = 'tv2'; main.prepend(box); }
    let h = '';
    if(focus){ const card = C.get(focus.id), I = info(focus, card), st = new Date(focus.start), en = new Date(focus.end), run = now >= +st, mins = Math.max(0, Math.round((+st - now) / 6e4));
      const bits = [I.last && 'Last class: ' + I.last, focus.meet && 'Meeting ' + focus.meet].filter(Boolean).join(' · ');
      h += '<div class="lb">' + (run ? 'Now · ends ' + hm(en) : 'Next class' + (mins ? ' · in ' + span(mins) : '')) + '</div>'
        + '<div class="fc" data-id="' + E(focus.id) + '"><div class="top"><div style="min-width:0"><div style="display:flex;align-items:center;flex-wrap:wrap;gap:4px"><span class="tm">' + hm(st) + '</span><span class="nm" data-s="' + E(focus.code) + '">' + E(focus.student || '') + '</span><span class="chip"><i style="background:' + I.col + '"></i>' + E(I.book) + (I.unitShort ? ' · ' + I.unitShort : '') + '</span></div>'
        + (bits ? '<div class="meta">' + E(bits) + '</div>' : '') + '</div>'
        + '<div class="acts">' + (card && card.querySelector('[onclick^="classBrief("]') ? '<button type="button" class="b2" data-a="brief">Class brief</button>' : '') + (card && card.querySelector('.cact .bkb') ? '<button type="button" class="b2 p" data-a="book">Open book' + (I.unitTxt && !/^Book$/i.test(I.unitTxt) ? ' · ' + E(I.unitTxt) : '') + '</button>' : '')
        + (card ? '<button type="button" class="b2 lk" data-a="more">' + (FOCUS_OPEN ? 'Hide details' : 'Details') + '</button>' : '') + '</div></div>'
        + (FOCUS_OPEN && card ? '<div class="fx" data-fx="1"></div>' : '') + '</div>'; }
    const row = c => { const card = C.get(c.id), I = info(c, card), st = new Date(c.start), len = Math.round((new Date(c.end) - st) / 6e4);
      if(c.cancelled) return '<tr class="x"><td class="t">' + hm(st) + '</td><td class="n"><b>' + E(c.student || '') + '</b></td><td colspan="3">Cancelled' + (c.why ? ' · ' + E(c.why) : '') + '</td></tr>';
      const op = OPEN.has(c.id) && card;
      return '<tr data-id="' + E(c.id) + '"' + (op ? ' class="op"' : '') + '><td class="t">' + hm(st) + '</td><td class="n"><b data-s="' + E(c.code) + '">' + E(c.student || '') + '</b>' + (len !== 25 ? '<small>' + len + ' min</small>' : '') + '</td>'
        + '<td class="bk"><span class="chip"><i style="background:' + I.col + '"></i>' + E(I.book) + (I.unitShort ? ' · ' + I.unitShort : '') + '</span></td><td>' + stepsHtml(I.st, I.trial) + '</td>'
        + '<td class="a">' + (card ? '<button type="button" class="b2 s" data-a="open">' + (op ? 'Close' : 'Open') + '</button>' : '') + '</td></tr>' + (op ? '<tr class="ex" data-ex="' + E(c.id) + '"><td colspan="5"></td></tr>' : ''); };
    const table = L => '<div class="tw"><table><tr><th>Time</th><th>Student</th><th>Book</th><th>In · Homework · Note · Video</th><th></th></tr>' + L.map(row).join('') + '</table></div>';
    h += '<div class="lb">' + (focus ? 'Rest of today' : 'Today') + '</div>' + (rest.length ? table(rest) : '<div class="emp">' + (focus ? 'No other classes left today.' : done.length ? 'All of today’s classes are finished.' : 'No classes today.') + '</div>');
    if(done.length){ const miss = done.filter(c => { const s = steps(C.get(c.id)); return s && s.includes('n'); }).length;
      h += '<details class="dn"' + (done.some(c => OPEN.has(c.id)) || box.querySelector('details.dn[open]') ? ' open' : '') + '><summary>Done today · ' + done.length + (miss ? ' · ' + miss + ' with something to finish' : '') + '</summary>' + table(done) + '</details>'; }
    h += '<div class="hint">Open a class for its homework, class note, video and time-in.</div>';
    box.innerHTML = h;
    /* the real class cards go where they are opened */
    if(focus && FOCUS_OPEN){ const card = C.get(focus.id), fx = box.querySelector('[data-fx]'); if(card && fx){ home(card); fx.appendChild(card); } }
    box.querySelectorAll('tr.ex').forEach(tr => { const card = C.get(tr.dataset.ex); if(card){ home(card); tr.firstElementChild.appendChild(card); } });
  }catch(e){ console.warn('2773', e); } }
  function needsYou(v, side){ try{ if(!side) return; const td = v.querySelector(':scope > .td1104'); let n = document.getElementById('ny2773');
      const rows = td ? [...td.querySelectorAll('.q1106 .qr')] : [], cnt = rows.length;
      if(!cnt){ if(n) n.remove(); return; }
      const first = rows[0], t = (first.querySelector('b, .qt, .t') || first).textContent.replace(/\s+/g, ' ').trim().slice(0, 140);
      const h = '<div class="lb">Needs you · ' + cnt + '</div><div class="it">' + E(t) + '</div><button type="button" class="b2">' + (td.classList.contains('show2773') ? 'Hide' : 'Open') + '</button>';
      if(!n){ n = document.createElement('div'); n.id = 'ny2773'; side.prepend(n); n.addEventListener('click', e => { if(!e.target.closest('button')) return; const t2 = document.querySelector('#v-today > .td1104'); if(!t2) return; const on = t2.classList.toggle('show2773'); if(on) t2.scrollIntoView({ behavior: 'smooth', block: 'start' }); e.target.textContent = on ? 'Hide' : 'Open'; }); }
      else if(n.parentNode !== side || side.firstElementChild !== n) side.prepend(n);
      if(n.__h !== h){ n.__h = h; n.innerHTML = h; } }catch(e){} }
  document.addEventListener('click', e => { const box = e.target.closest && e.target.closest('#tv2'); if(!box) return;
    const a = e.target.closest('[data-a]'), s = e.target.closest('[data-s]');
    if(s && !a){ try{ openStudent(s.dataset.s); }catch(x){} return; }
    if(!a) return; const fc = a.closest('.fc'), tr = a.closest('tr[data-id]'), id = fc ? fc.dataset.id : tr ? tr.dataset.id : '';
    const card = (() => { const m = cards(document.getElementById('v-today')); return m.get(id); })();
    if(a.dataset.a === 'brief' && card){ const b = card.querySelector('[onclick^="classBrief("]'); if(b) b.click(); }
    else if(a.dataset.a === 'book' && card){ const b = card.querySelector('.cact .bkb'); if(b) b.click(); }
    else if(a.dataset.a === 'more'){ FOCUS_OPEN = !FOCUS_OPEN; SIG = ''; build(); }
    else if(a.dataset.a === 'open'){ OPEN.has(id) ? OPEN.delete(id) : OPEN.add(id); SIG = ''; build(); } });
  const hook = () => { const rt = window.renderToday; if(typeof rt !== 'function' || rt.__p2773) return; const w = function(){ sendHome(); SIG = ''; const r = rt.apply(this, arguments); build(); setTimeout(build, 0); setTimeout(build, 450); setTimeout(build, 1300); return r; }; Object.keys(rt).forEach(k => { try{ w[k] = rt[k]; }catch(e){} }); w.__p2773 = 1; window.renderToday = w; try{ renderToday = w; }catch(e){} };
  hook(); setTimeout(hook, 2500); setTimeout(hook, 10000); setInterval(() => { hook(); build(); }, 20000); setTimeout(build, 300); setTimeout(build, 1500); setTimeout(build, 4000);
  window.p2773 = build;
})();
