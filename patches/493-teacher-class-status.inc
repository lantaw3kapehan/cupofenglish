/* 21 Oct · 493 · Teacher Today · class cards (Misty: "minimal, effective, straightforward and productive"; one fact = symbol + colour + word).
   Each of today's classes gets one row of four small status pills — In · Homework · Note · Video:
     green ✓ done · coral ! due now (tap = do it) · grey ○ later (class not started / not finished yet).
   The green "done" boxes under the card (Homework given, Class note saved, Video uploaded) fold into those pills, so a card only shows
   a box when something still needs doing. Trials and cancelled classes keep their own buttons; nothing else changes. */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#v-today .cs93{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
#v-today .cs93 span{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:700;padding:3px 10px 3px 7px;border-radius:999px;cursor:pointer;user-select:none}
#v-today .cs93 span i{display:inline-grid;place-items:center;width:16px;height:16px;border-radius:50%;font-style:normal;font-size:10px;line-height:1}
#v-today .cs93 .d{background:#EEF8F3;color:#1F6B45} #v-today .cs93 .d i{background:#2E9E6F;color:#fff}
#v-today .cs93 .n{background:#FCEFEB;color:#9A3B26} #v-today .cs93 .n i{background:#D4705A;color:#fff}
#v-today .cs93 .l{background:#F4F3F8;color:#8A86A0;cursor:default} #v-today .cs93 .l i{border:1.5px solid #C9C6D6;width:13px;height:13px}
#v-today .cls.f93 .hw.ok{display:none}`;
  document.head.appendChild(css);
  const pill = (st, lab, on, tip) => '<span class="' + st + '" title="' + esc(tip || '') + '"' + (on && st === 'n' ? ' onclick="' + on + '"' : '') + '><i>' + (st === 'd' ? '✓' : st === 'n' ? '!' : '') + '</i>' + lab + '</span>';
  function paint(){ const v = document.getElementById('v-today'); if(!v || !D || D.mgr) return; const now = new Date();
    const L = (D.schedule || []).filter(c => c.day === D.today && !c.cancelled).sort((a, b) => String(a.start).localeCompare(String(b.start))), first = L[0];
    v.querySelectorAll('.cls').forEach(card => { if(card.classList.contains('x') || card.querySelector('.cs93')) return;
      const b = card.querySelector('[onclick^="classBrief("]'); if(!b) return; const id = (b.getAttribute('onclick').match(/classBrief\('([^']+)'/) || [])[1];
      const c = L.find(x => x.id === id); if(!c || c.type === 'Trial' || !c.code) return;
      const st = new Date(c.start), en = new Date(c.end), started = now >= st, ended = now > en;
      const ci = (D.classIns || {})[c.id], isFirst = first && first.id === c.id, inDone = !!(ci && ci.time) || (isFirst && D.timeIn);
      const contPrev = L.find(x => x.id !== c.id && x.code === c.code && +new Date(x.end) === +st);
      const inSt = inDone || contPrev ? 'd' : now >= new Date(+st - 5 * 6e4) ? 'n' : 'l';
      const hw = (D.hw || {})[c.id], hwSt = hw ? 'd' : started ? 'n' : 'l';
      const s = ((D.students || []).find(x => x.code === c.code) || {}), n = s.note, noteOk = n && n.date === c.day && (n.obs || n.ended) && (!n.eventId || n.eventId === c.id);
      const noteSt = noteOk ? 'd' : ended ? 'n' : 'l';
      const vd = (D.vids || {})[c.id], vSt = vd && vd.url ? 'd' : ended ? 'n' : 'l';
      const cd = esc(c.code), ci2 = esc(c.id), dy = esc(c.day);
      const html = '<div class="cs93">' +
        pill(inSt, 'In', isFirst ? 'timeInSheet()' : D.timeIn ? "classIn('" + ci2 + "')" : 'timeInSheet()', inSt === 'd' ? (contPrev ? 'Same class as before · no I’m in needed' : 'In') : inSt === 'n' ? 'Tap to time in' : 'Opens 5 minutes before class') +
        pill(hwSt, 'Homework', "hwSheet('" + ci2 + "')", hwSt === 'd' ? 'Homework given' + (hw && hw.time ? ' · ' + hw.time : '') : hwSt === 'n' ? 'Mark the homework' : 'After the class starts') +
        pill(noteSt, 'Note', "noteSheet('" + cd + "','" + ci2 + "','" + dy + "')", noteSt === 'd' ? 'Class note saved' : noteSt === 'n' ? 'Add today’s class note' : 'After the class') +
        pill(vSt, 'Video', "(function(e){var r=e&&e.closest('.cls');var h=r&&[...r.querySelectorAll('.hw')].find(function(x){return /video/i.test(x.textContent)});if(h)h.scrollIntoView({behavior:'smooth',block:'center'})})(this)", vSt === 'd' ? 'Video uploaded' : vSt === 'n' ? 'Upload the class video' : 'After the class') +
        '</div>';
      const top = card.querySelector('.grow > .small.mute') || card.querySelector('.grow > .row'); if(top) top.insertAdjacentHTML('afterend', html); else card.querySelector('.grow').insertAdjacentHTML('afterbegin', html);
      card.classList.add('f93'); }); }
  const _rt = window.renderToday; if(_rt) window.renderToday = function(){ const r = _rt.apply(this, arguments); try{ paint(); }catch(e){ console.warn('cs93', e); } setTimeout(() => { try{ paint(); }catch(e){} }, 300); return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'today') renderToday(); }catch(e){}
})();
