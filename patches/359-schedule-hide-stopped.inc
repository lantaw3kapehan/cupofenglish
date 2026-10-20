/* 20 Oct · 359 · Schedule: classes cancelled ahead of time are hidden (Misty: "lessons that have been cancelled moving forward … just a clutter")
   (cards are only hidden on screen; the list and its numbers stay the same, so every button keeps opening the right class)
   A cancelled class is hidden when it was cancelled on an earlier day than the class (a stopped schedule, a parent who changed days, a teacher change).
   Cancelled the same day stays on the schedule (it matters for that day). One quiet line at the bottom says how many are hidden, with "Show". */
(function(){
  let SHOW = false;
  const MON = 'janfebmaraprmayjunjulaugsepoctnovdec';
  const dayOf = e => new Date(new Date(e.start).getTime() + 8 * 3600e3).toISOString().slice(0, 10);
  function early(e){ if(!e || !e.cancelled) return false; const m = String(e.why || '').match(/·\s*([A-Za-z]{3})[a-z]*\s+(\d{1,2})\s*$/); if(!m) return false;
    const M = MON.indexOf(m[1].toLowerCase()) / 3 + 1; if(M < 1) return false; const d = dayOf(e), y = +d.slice(0, 4), cm = +d.slice(5, 7);
    const cy = M > cm + 1 ? y - 1 : y, c = cy + '-' + String(M).padStart(2, '0') + '-' + String(+m[2]).padStart(2, '0'); return c < d; }
  window.scHiddenToggle = () => { SHOW = !SHOW; try{ renderSchedule(); }catch(e){} };
  function hide(){ try{ if(typeof SC === 'undefined' || !SC || !Array.isArray(SC.events)) return; const v = $('v-schedule'); if(!v) return;
    const idx = []; SC.events.forEach((e, i) => { if(early(e)) idx.push(i); });
    let n = 0; idx.forEach(i => { v.querySelectorAll('[onclick^="classEdit(' + i + ')"], [onclick^="classEdit(' + i + ',"]').forEach(el => { el.style.display = SHOW ? '' : 'none'; n++; }); });
    v.querySelectorAll('.s2-g').forEach(g => { const any = [...g.children].some(c => c.style.display !== 'none'); g.style.display = any ? '' : 'none'; const h = g.previousElementSibling; if(h && h.classList.contains('s2-slot')) h.style.display = any ? '' : 'none'; });   /* a time with only hidden classes goes too */
    note(idx.length); }catch(e){} }
  const _rs = window.renderSchedule; if(_rs) window.renderSchedule = function(){ const r = _rs.apply(this, arguments); hide(); return r; };
  function note(n){ try{ const v = $('v-schedule'); if(!v || !n) return; const old = v.querySelector('.sc-hid'); if(old) old.remove();
    v.insertAdjacentHTML('beforeend', `<div class="sc-hid small mute" style="margin:14px 2px 4px">${n} class${n === 1 ? '' : 'es'} cancelled ahead of time ${SHOW ? 'shown' : 'hidden'} (stopped or changed schedules) · <a href="#" onclick="scHiddenToggle();return false">${SHOW ? 'Hide' : 'Show'}</a></div>`); }catch(e){} }
})();
