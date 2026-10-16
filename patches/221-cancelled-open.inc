/* 16 Oct · Misty: when a class is cancelled, its time shows as open for that teacher on that day.
   · The cancelled card says "Open · Teacher Mayi is free 21:00–21:25" with a Book button (fills in Add class).
   · The teacher's open slots on Schedule include it (★, "freed · Aurora cancelled").
   Only for times still ahead, and only when no other class of hers is booked in that time. */
(function(){
  document.head.insertAdjacentHTML('beforeend', '<style>.cxo{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:8px;padding:6px 10px;border-radius:10px;background:#EAF8F6;color:#0B5F59;font-size:13px;font-weight:700;opacity:1}.cxo i{width:7px;height:7px;border-radius:50%;background:#16BCB0}.cxo .btn{padding:3px 12px}.cls.x .cxo{filter:none}</style>');
  const key = n => String(n || '').replace(/^teacher\s+/i, '').trim().toLowerCase();
  function freed(e){ if(!e || !e.cancelled || !SC) return false; const s = +new Date(e.start), en = +new Date(e.end); if(s < Date.now()) return false;
    return !SC.events.some(x => !x.cancelled && x !== e && key(x.teacher) === key(e.teacher) && +new Date(x.start) < en && +new Date(x.end) > s); }
  window.scFreed = freed;
  window.cxBook = async function(i){ const e = SC && SC.events[i]; if(!e) return; const x = new Date(e.start), mins = Math.round((new Date(e.end) - x) / 6e4); await classForm();
    const set = (id, v) => { const el = $(id); if(!el) return; if(el.tagName === 'SELECT' && ![...el.options].some(op => op.value === String(v))) el.insertAdjacentHTML('beforeend', '<option value="' + esc(v) + '">' + esc(v) + '</option>'); el.value = String(v); el.dispatchEvent(new Event('input')); el.dispatchEvent(new Event('change')); };
    set('cD', ymdLocal(x)); set('cH', tm(e.start)); set('cT', e.teacher); set('cM', mins); try{ classPrev(); }catch(err){}
    toast('Teacher ' + e.teacher + ' · ' + tm(e.start) + ' (freed by ' + (e.student || 'a cancellation') + ') · now choose the student'); const s = $('cS'); if(s) s.focus(); };
  const base = window.renderSchedule;
  window.renderSchedule = function(){ const r = base.apply(this, arguments);
    try{ const v = $('v-schedule'); if(!v || !SC) return r;
      v.querySelectorAll('.cls.x').forEach(c => { const m = /classEdit\((\d+)/.exec(c.getAttribute('onclick') || ''), e = m && SC.events[+m[1]]; if(!e || !freed(e) || c.querySelector('.cxo')) return;
        const g = c.querySelector('.grow'); if(!g) return;
        g.insertAdjacentHTML('beforeend', `<div class="cxo"><i></i><span class="grow">Open · Teacher ${esc(e.teacher)} is free ${tm(e.start)}–${tm(e.end)}</span><button class="btn sm teal" onclick="event.stopPropagation();cxBook(${m[1]})">Book this time</button></div>`); });
    }catch(e){}
    return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'schedule') renderSchedule(); }catch(e){}
})();
