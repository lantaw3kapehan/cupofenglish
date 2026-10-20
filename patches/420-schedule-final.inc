/* 20 Oct · 420 · Schedule final polish (Misty). Style and order only.
   · Reminders due: a calm card with an amber edge, one compact line per class (time · student · code · teacher · kind ·
     Sent / Copy), "Mark all sent" on the header line; the "all sent ✓" line is a small green note.
   · Summary and Day at a glance in the app card style; the book colour key moves to a quiet line under the list header.
   · Rows: the "Remind · copy message" button is a small outlined pill; finished classes fold into one closed row.
   · Small part labels: Today · To send · Classes. */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#v-schedule .s2-sum{border:1px solid var(--line)!important;border-radius:var(--r-lg)!important;box-shadow:var(--sh1)}
#v-schedule .lb20{margin:20px 2px 0;font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;color:#8A86A0;display:flex;align-items:center;gap:10px}
#v-schedule .lb20:after{content:'';flex:1;border-top:1px solid var(--line)}
#v-schedule .card.rd20{border:1px solid var(--line)!important;border-left:4px solid #E0A030!important;border-radius:var(--r-lg)!important;box-shadow:var(--sh1);padding:12px 16px!important}
#v-schedule .card.rd20>.row{margin-top:0!important;padding:7px 0;border-top:1px solid #F3F2F7}
#v-schedule .card.rd20>.row .grow{display:flex;flex-wrap:wrap;align-items:baseline;column-gap:8px}
#v-schedule .card.rd20>.row .grow>div{font-size:12.5px}
#v-schedule .card.rd20 .btn{padding:6px 12px!important;font-size:13px!important;min-height:0!important}
#v-schedule .rd20h{display:flex;align-items:center;gap:10px;margin-bottom:6px}
#v-schedule .rd20h b{font-size:15px}
#v-schedule .rd20h .small{flex:1}
#v-schedule .ok20{margin-top:10px;font-size:13px;color:#1C7A55;background:#E8F6EE;border-radius:999px;padding:6px 12px;display:inline-block}
#v-schedule .bkl{margin:6px 2px 0!important;opacity:.85;font-size:12px}
#v-schedule .cxbtn{background:#fff!important;border:1px solid #BFE6E3!important;color:#00737B!important;border-radius:999px!important;padding:3px 10px!important;font-size:12px!important;box-shadow:none!important}
#v-schedule details.fin20{margin-top:16px;background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);box-shadow:var(--sh1)}
#v-schedule details.fin20>summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:10px;padding:12px 16px;font-weight:600;color:var(--ink)}
#v-schedule details.fin20>summary::-webkit-details-marker{display:none}
#v-schedule details.fin20>summary span{font-weight:400;font-size:13px;color:#8A86A0}
#v-schedule details.fin20>summary:after{content:'›';margin-left:auto;color:#8A86A0;font-size:18px;transition:transform .15s}
#v-schedule details.fin20[open]>summary:after{transform:rotate(90deg)}
#v-schedule details.fin20>div{padding:0 12px 10px}
#v-schedule .dg16 .nw2{position:absolute;top:-10px;bottom:0;border-left:1.5px dashed #00A3AD;z-index:2}
#v-schedule .dg16 .nw2:after{content:'now';position:absolute;top:-4px;left:3px;font-size:10px;color:#00808A}`;
  document.head.appendChild(css);
  function nowLine(){ const g = document.querySelector('#v-schedule .dg16'); if(!g || SC_OFF) return; const n = g.querySelector('.nw'); if(n) n.remove();
    const d = new Date(), c = [...g.querySelectorAll('.c')].find(x => (x.getAttribute('onclick') || '').indexOf('sc16Go(' + d.getHours() + ')') === 0);
    if(c && !c.querySelector('.nw2')) c.insertAdjacentHTML('beforeend', '<span class="nw2" style="left:' + Math.round(d.getMinutes() / 60 * 100) + '%"></span>'); }
  function polish(){ nowLine(); const v = $('v-schedule'); if(!v || v.querySelector('.lb20')) return;
    const sum = v.querySelector('.s2-sum'); if(sum) sum.insertAdjacentHTML('beforebegin', '<div class="lb20">Today</div>');
    /* reminders */
    const rd = [...v.querySelectorAll(':scope > .card')].find(c => /Reminders due/.test(c.textContent));
    if(rd){ rd.classList.add('rd20'); rd.style.border = ''; const b = rd.querySelector(':scope > b'), s = rd.querySelector(':scope > .small'); const all = [...rd.querySelectorAll('button')].find(x => /Mark all/.test(x.textContent));
      if(b){ const h = document.createElement('div'); h.className = 'rd20h'; rd.insertBefore(h, b); h.appendChild(b); if(s) h.appendChild(s); if(all){ const w = all.closest('div') !== rd ? all.closest('div') : null; h.appendChild(all); if(w && !w.textContent.trim()) w.remove(); } }
      rd.insertAdjacentHTML('beforebegin', '<div class="lb20">To send</div>'); }
    else { const ok = [...v.querySelectorAll(':scope > .small.mute')].find(x => /Reminders:/.test(x.textContent)); if(ok){ ok.className = 'ok20'; } }
    /* classes label + finished fold */
    const segB = [...v.querySelectorAll('.seg')].find(x => /By time/.test(x.textContent)); let seg = segB; while(seg && seg.parentElement !== v) seg = seg.parentElement;
    const firstRow = v.querySelector('.hh16') || v.querySelector('.cls'); let anchor = firstRow; while(anchor && anchor.parentElement !== v) anchor = anchor.parentElement;
    const key = v.querySelector(':scope > .bkl');
    if(seg && anchor){ v.insertBefore(seg, anchor); if(key) v.insertBefore(key, anchor); seg.insertAdjacentHTML('beforebegin', '<div class="lb20">Classes</div>'); }
    else if(seg) seg.insertAdjacentHTML('beforebegin', '<div class="lb20">Classes</div>');
    const fh = [...v.querySelectorAll(':scope > h2')].find(h => /^Finished/.test(h.textContent)); if(fh){ const list = fh.nextElementSibling; const d = document.createElement('details'); d.className = 'fin20';
      d.innerHTML = '<summary>Finished<span>' + esc((fh.querySelector('.c') || {}).textContent || '') + '</span></summary><div></div>'; fh.replaceWith(d); if(list) d.querySelector('div').appendChild(list); }
  }
  const base = window.renderSchedule; window.renderSchedule = function(){ const r = base.apply(this, arguments); try{ polish(); }catch(e){ console.warn('sc20', e); } return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'schedule') renderSchedule(); }catch(e){}
})();
